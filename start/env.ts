/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),
  SECRET_KEY: Env.schema.string(),
  CONTACT_ADMIN: Env.schema.string(),
  URL_HOADONDIENTU: Env.schema.string({ format: 'url' }),
  URL_TRACUUNNT: Env.schema.string({ format: 'url' }),
  URL_MASOTHUE: Env.schema.string({ format: 'url' }),
  COUNT_LOGIN_FAIL: Env.schema.number(),
  MODEL_CAPCHA_HDDT: Env.schema.string(),
  PAGE_REDIRECTION:Env.schema.boolean(),
  HEADLESS:Env.schema.boolean(),
  /*
  |----------------------------------------------------------
  | Variables for configuring session package
  |----------------------------------------------------------
  */
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory'] as const)
})
