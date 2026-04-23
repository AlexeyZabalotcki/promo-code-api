import * as Joi from 'joi';

/**
 * Validated process.env shape; used with ConfigModule.forRoot({ validationSchema }).
 */
export const envValidation = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development')
    .optional(),
  PORT: Joi.string()
    .pattern(/^\d+$/)
    .default('3000')
    .optional(),
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'log', 'debug', 'verbose').default('log'),
  DATABASE_URL: Joi.string().pattern(/^postgres(ql)?:\/\//).required(),
});
