import {
  Column,
  Entity,
  Index,
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { BaseEntity } from '../../../../common/base.entity';
import { BOT_TABLES } from 'src/common/enums/bot.enum';

/**
 * Enum representing possible configuration value types
 */
export enum ConfigValueType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  OBJECT = 'object',
  ARRAY = 'array',
  DATE = 'date',
}

/**
 * Config entity for storing application configuration values
 * Supports multiple data types through JSON serialization/deserialization
 */
@Entity(BOT_TABLES.CONFIG)
export class Config extends BaseEntity {
  @Column({ unique: true, length: 255 })
  @Index()
  key: string;

  /**
   * Data type of the stored value
   */
  @Column({
    type: 'enum',
    enum: ConfigValueType,
    comment: 'Data type of the stored configuration value',
  })
  type: ConfigValueType;

  /**
   * JSON serialized value of the configuration
   */
  @Column({
    type: 'text',
    comment: 'JSON serialized configuration value',
  })
  jsonValue: string;

  /**
   * Deserialized value, available after entity is loaded
   * Not stored in database
   */
  value: unknown;

  @Column({
    default: false,
    comment: 'Indicates if this configuration is currently active',
  })
  isActive: boolean;

  @Column({
    nullable: true,
    comment: 'Human-readable description of this configuration',
  })
  description?: string;

  /**
   * Deserialize jsonValue into value property after loading entity
   */
  @AfterLoad()
  deserializeValue() {
    try {
      let parsedValue = JSON.parse(this.jsonValue);

      // Convert back to Date objects if the type is DATE
      if (
        this.type === ConfigValueType.DATE &&
        typeof parsedValue === 'string'
      ) {
        parsedValue = new Date(parsedValue);
      }

      this.value = parsedValue;
    } catch (e) {
      this.value = this.jsonValue;
    }
  }

  /**
   * Serialize value into jsonValue before inserting or updating
   */
  @BeforeInsert()
  @BeforeUpdate()
  serializeValue() {
    if (this.value !== undefined) {
      // Infer type if not explicitly set
      if (!this.type) {
        if (Array.isArray(this.value)) {
          this.type = ConfigValueType.ARRAY;
        } else if (this.value instanceof Date) {
          this.type = ConfigValueType.DATE;
        } else {
          this.type = typeof this.value as ConfigValueType;
        }
      }

      this.jsonValue = JSON.stringify(this.value);
    }
  }

  /**
   * Create a new config entry
   */
  static createConfig(key: string, value: any, description?: string): Config {
    const config = new Config();
    config.key = key;
    config.value = value;

    // Determine type based on value
    if (Array.isArray(value)) {
      config.type = ConfigValueType.ARRAY;
    } else if (value instanceof Date) {
      config.type = ConfigValueType.DATE;
    } else {
      config.type = typeof value as ConfigValueType;
    }

    config.jsonValue = JSON.stringify(value);
    config.description = description;
    return config;
  }
}
