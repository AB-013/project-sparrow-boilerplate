export const AUTH_FAILED = 'Username or password is incorrect';
export const DATABASE_CONFIG_REQUIRED = (param: string) =>
  `Database connection configuration param ${param} not found`;

export const ENV_VARIABLE_REQUIRED = (variable: string) =>
  `environment variable ${variable} is required.`;

export const ENV_VARIABLE_INVALID = (variable: string) =>
  `environment variable ${variable} is invalid.`;

export const MICROSERVICES_CONFIG_REQUIRED = (param: string) =>
  `Microservice config ${param} not found`;

export const NOT_FOUND_ERROR = (item: string) => `${item} not found!`;
