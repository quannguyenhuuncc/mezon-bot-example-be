import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigController } from './config.controller';
import { Config } from './domain/entities/config.entity';
import { ConfigService } from './config.service';

@Global() // Make this module globally available
@Module({
  imports: [TypeOrmModule.forFeature([Config])],
  providers: [
    ConfigService,
    {
      provide: 'APP_CONFIG',
      useFactory: async (configService: ConfigService) => {
        // Load all configs when the application starts
        return await configService.loadAllConfigs();
      },
      inject: [ConfigService],
    },
  ],
  controllers: [ConfigController],
  exports: [ConfigService, 'APP_CONFIG'], // Export both service and provider
})
export class ConfigModule {}
