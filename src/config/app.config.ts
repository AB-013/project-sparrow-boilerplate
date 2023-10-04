import { registerAs } from '@nestjs/config';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import validateConfig from 'src/utils/validate-config';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: number;

  @IsString()
  @IsOptional()
  APP_NAME: string;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsInt()
  @Min(5)
  @Max(20)
  APP_BCRYPT_SALT: number;

  @IsString()
  @IsOptional()
  APP_ALLOWED_ORIGINS: string;
}

export interface IAppConfig {
  nodeEnv: string;
  name: string;
  port: number;
  apiPrefix: string;
  bcryptSalt: number;
  allowedOrigins: string[];
}

export default registerAs('app', (): IAppConfig => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'app',
    port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 3000,
    apiPrefix: process.env.API_PREFIX || 'api',
    bcryptSalt: parseInt(process.env.APP_BCRYPT_SALT, 10) || 10,
    allowedOrigins: process.env.APP_ALLOWED_ORIGINS
      ? process.env.APP_ALLOWED_ORIGINS.split(',')
      : [],
  };
});
