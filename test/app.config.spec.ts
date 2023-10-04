import { NotFoundException } from '@nestjs/common';
import {
  ConfigFactory,
  ConfigModule,
  ConfigObject,
  ConfigService,
} from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import appConfig, { IAppConfig } from '@src/config/app.config';
import authConfig from '@src/config/auth.config';
import dbConfig, { IDatabaseConfig } from '@src/config/database.config';
import { DATABASE_CONFIG_REQUIRED } from '@src/utils/error-messages';

/**
 * @param configs the config array passed to ConfigModule.forRoot() as 'load'
 * @param paramsToTest list of ENV variable names that need to be tested, the order of these matter.
 * @param paramToErrorMapper a function that is given an env variable name, and it returns the string error
 * that should be thrown when this param is missing.
 */
async function testConfigSet(
  configs: ConfigFactory<ConfigObject>[],
  paramsToTest: string[],
  paramToErrorMapper: (param: string) => string,
) {
  // we will be polluting process.env, that might
  // cause other tests to fail. So saving it here.
  const originalProcessEnv = process.env;

  // copy process.env
  process.env = {};

  // Every iteration of the loop we expect
  // the error thrown to show the name of the variable
  // missing, and before the next iteration we add that variable
  // so in the next iteration the next variable is missing.
  // Note here that that order of variables in the 'paramsToTest' list
  // is important.
  for (const p of paramsToTest) {
    await expect(async () =>
      Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            load: configs,
            isGlobal: true,
            cache: true,
          }),
        ],
        controllers: [AppController],
        providers: [AppService],
      }).compile(),
    ).rejects.toThrowError(new NotFoundException(paramToErrorMapper(p)));
    process.env[p] = 'defined';
  }

  process.env = originalProcessEnv;
}

describe('Application Configuration registration tests', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('Invalid or no env file provided', () => {
    it('database config should raise errors when variables are missing', async () => {
      await testConfigSet(
        [dbConfig],
        [
          'DATABASE_URL',
          'DATABASE_TYPE',
          'DATABASE_HOST',
          'DATABASE_PORT',
          'DATABASE_NAME',
          'DATABASE_PASSWORD',
          'DATABASE_USERNAME',
          'DATABASE_SCHEMA',
        ],
        (p) => DATABASE_CONFIG_REQUIRED(p),
      );
    });

    // it('app config should raise an error', async () => {
    //   await testConfigSet(
    //     [appConfig],
    //     [
    //       'APP_NAME',
    //       'APP_PORT',
    //       'APP_PREFIX',
    //       'APP_BCRYPT_SALT',
    //       'ALLOWED_ORIGINS',
    //     ],
    //     (p) => ENV_VARIABLE_REQUIRED(p),
    //   );
    // });

    // it('auth config should raise an error', async () => {
    //   await testConfigSet(
    //     [authConfig],
    //     ['AUTH_JWT_SECRET', 'AUTH_JWT_TOKEN_EXPIRES_IN'],
    //     (p) => ENV_VARIABLE_REQUIRED(p),
    //   );
    // });
  });

  //   describe('has valid development env', () => {
  //     let configService: ConfigService;
  //     beforeEach(async () => {
  //       const app: TestingModule = await Test.createTestingModule({
  //         imports: [
  //           ConfigModule.forRoot({
  //             load: [appConfig, dbConfig],
  //             isGlobal: true,
  //             cache: true,
  //             envFilePath: `src/.env/.env.development.sample`,
  //           }),
  //         ],
  //         controllers: [AppController],
  //         providers: [AppService],
  //       }).compile();

  //       configService = app.get<ConfigService>(ConfigService);
  //     });
  //     it('should return develop database config', () => {
  //       expect(configService.get<IDatabaseConfig>('database')).toBeDefined();
  //       const {
  //         host,
  //         port,
  //         username,
  //         type,
  //         password,
  //         database,
  //         synchronize,
  //         extra: { max },
  //       } = configService.get<IDatabaseConfig>('database') as IDatabaseConfig;

  //       expect(host).toBe('localhost');
  //       expect(port).toBe(5432);
  //       expect(username).toBe('superAdmin');
  //       expect(password).toBe('superAdminPass');
  //       expect(database).toBe('dgf-360-admin');
  //       expect(type).toBe('postgres');
  //       expect(synchronize).toBeFalsy();
  //       expect(max).toBe(10);
  //     });
  //   });

  //   describe('Has valid production env', () => {
  //     let configService: ConfigService;
  //     beforeEach(async () => {
  //       const app: TestingModule = await Test.createTestingModule({
  //         imports: [
  //           ConfigModule.forRoot({
  //             load: [appConfig, dbConfig],
  //             isGlobal: true,
  //             cache: true,
  //             envFilePath: `.env.production.sample`,
  //           }),
  //         ],
  //         controllers: [AppController],
  //         providers: [AppService],
  //       }).compile();

  //       configService = app.get<ConfigService>(ConfigService);
  //     });
  //     it('should return production database config', () => {
  //       expect(configService.get<IDatabaseConfig>('database')).toBeDefined();
  //       const {
  //         host,
  //         port,
  //         username,
  //         type,
  //         password,
  //         database,
  //         synchronize,
  //         extra: { max },
  //         namingStrategy,
  //       } = configService.get<IDatabaseConfig>('database') as IDatabaseConfig;

  //       expect(host).toBe('localhost');
  //       expect(port).toBe(5432);
  //       expect(username).toBe('superAdmin');
  //       expect(password).toBe('superAdminPass');
  //       expect(database).toBe('dgf-360-admin');
  //       expect(type).toBe('postgres');
  //       expect(synchronize).toBeFalsy();
  //       expect(namingStrategy).toBeDefined();
  //       expect(namingStrategy).toBeInstanceOf(SnakeNamingStrategy);
  //       expect(max).toBe(10);
  //     });
  //     it('should return app config', () => {
  //       expect(configService.get<IAppConfig>('app')).toBeDefined();
  //       const {
  //         port,
  //         name,
  //         workingDirectory,
  //         apiPrefix,
  //         appBaseUrl,
  //         fallbackLanguage,
  //         nodeEnv,
  //       } = configService.get<IAppConfig>('app') as IAppConfig;

  //       expect(name).toBe('digital-flow-360');
  //       expect(port).toBe(3000);
  //       expect(workingDirectory).toBeDefined();
  //       expect(apiPrefix).toBe('');
  //       expect(appBaseUrl).toBe('http://localhost:3000');
  //       expect(fallbackLanguage).toBe('en');
  //       expect(nodeEnv).toBeDefined();
  //     });
  //   });
});
