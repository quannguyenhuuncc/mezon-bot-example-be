import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Config } from './domain/entities/config.entity';
import { Repository } from 'typeorm';
import { ConfigResponseDto } from './dto/config-response.dto';
import { CreateConfigDto } from './dto/create-config.dto';
import { BOT_CONFIG_DYNAMIC_KEYS } from 'src/common/enums/bot.enum';

@Injectable()
export class ConfigService implements OnModuleInit {
  private readonly logger = new Logger(ConfigService.name);
  private configCache: Map<string, unknown> = new Map();

  constructor(
    @InjectRepository(Config)
    private readonly configRepository: Repository<Config>,
  ) {}

  async onModuleInit() {
    await this.loadAllConfigs();
  }

  async loadAllConfigs(): Promise<Record<string, unknown>> {
    try {
      const configs = await this.configRepository.find();

      const configObject: Record<string, any> = {};
      configs.forEach(config => {
        this.configCache.set(config.key, config.value);
        configObject[config.key] = config.value;
      });

      this.logger.log(`Loaded ${configs.length} configurations into cache`);
      return configObject;
    } catch (error) {
      this.logger.error(`Failed to load configs: ${error.message}`);
      return {};
    }
  }

  get(key: string, defaultValue?: any): any {
    return this.configCache.has(key) ? this.configCache.get(key) : defaultValue;
  }

  getAllConfigs(): Promise<ConfigResponseDto[]> {
    return this.configRepository
      .find()
      .then(configs => configs.map(config => new ConfigResponseDto(config)))
      .catch(error => {
        this.logger.error(`Failed to get all configs: ${error.message}`);
        throw error;
      });
  }

  async getConfigByKey(key: string): Promise<ConfigResponseDto | null> {
    return this.configRepository
      .findOne({ where: { key } })
      .then(config => (config ? new ConfigResponseDto(config) : null))
      .catch(error => {
        this.logger.error(
          `Failed to get config by key ${key}: ${error.message}`,
        );
        throw error;
      });
  }

  async createConfig(
    config: Partial<CreateConfigDto>,
  ): Promise<ConfigResponseDto> {
    const result = await this.configRepository
      .save(config)
      .then(config => new ConfigResponseDto(config))
      .catch(error => {
        this.logger.error(`Failed to create config: ${error.message}`);
        throw error;
      });

    this.configCache.set(result.key, result.value);
    return result;
  }

  async updateConfigValue(
    key: string,
    value: unknown,
  ): Promise<ConfigResponseDto> {
    return this.configRepository.findOne({ where: { key } }).then(config => {
      if (!config) {
        throw new Error(`Config with key ${key} not found`);
      }
      const typeValidators = {
        array: (val: unknown): boolean => Array.isArray(val),
        date: (val: unknown): boolean => val instanceof Date,
        number: (val: unknown): boolean => typeof val === 'number',
        string: (val: unknown): boolean => typeof val === 'string',
        boolean: (val: unknown): boolean => typeof val === 'boolean',
        object: (val: unknown): boolean =>
          typeof val === 'object' && val !== null,
      };

      const validator =
        typeValidators[config.type as keyof typeof typeValidators];
      if (validator && !validator(value)) {
        throw new Error(`Value for config ${key} must be a ${config.type}`);
      }
      config.value = value;
      return this.configRepository.save(config).then(config => {
        // Update cache
        this.configCache.set(key, value);
        return new ConfigResponseDto(config);
      });
    });
  }

  async updateConfigActive(
    key: string,
    active: boolean,
  ): Promise<ConfigResponseDto> {
    if (BOT_CONFIG_DYNAMIC_KEYS.includes(key) && !active) {
      throw new Error(`Cannot deactivate dynamic config ${key}`);
    }
    return this.configRepository.findOne({ where: { key } }).then(config => {
      if (!config) {
        throw new Error(`Config with key ${key} not found`);
      }
      config.isActive = active;
      return this.configRepository
        .save(config)
        .then(config => new ConfigResponseDto(config));
    });
  }

  async deleteConfig(key: string): Promise<void> {
    if (BOT_CONFIG_DYNAMIC_KEYS.includes(key)) {
      throw new Error(`Cannot delete dynamic config ${key}`);
    }
    return this.configRepository
      .delete({ key })
      .then(result => {
        if (result.affected === 0) {
          throw new Error(`Config with key ${key} not found`);
        }
        this.configCache.delete(key);
      })
      .catch(error => {
        this.logger.error(`Failed to delete config ${key}: ${error.message}`);
        throw error;
      });
  }
}
