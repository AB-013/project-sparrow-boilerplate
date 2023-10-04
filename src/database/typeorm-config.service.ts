import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { IAppConfig } from 'src/config/app.config';
import { IDatabaseConfig } from 'src/config/database.config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const appConfig = this.configService.get<IAppConfig>('app');
    const dbConfig = this.configService.get<IDatabaseConfig>('database');

    return {
      type: dbConfig.type,
      url: dbConfig.url,
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.name,
      synchronize: dbConfig.synchronize,
      dropSchema: false,
      keepConnectionAlive: true,
      logging: appConfig.nodeEnv !== 'production',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    } as TypeOrmModuleOptions;
  }
}
