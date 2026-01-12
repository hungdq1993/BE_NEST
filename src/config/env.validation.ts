import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),

  // Database
  MONGODB_URI: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  // Firebase (optional for initial setup)
  FIREBASE_PROJECT_ID: Joi.string().optional(),
  FIREBASE_PRIVATE_KEY: Joi.string().optional(),
  FIREBASE_CLIENT_EMAIL: Joi.string().optional(),

  // Payment Gateways (optional for initial setup)
  VNPAY_TMN_CODE: Joi.string().optional(),
  VNPAY_HASH_SECRET: Joi.string().optional(),
  MOMO_PARTNER_CODE: Joi.string().optional(),
  MOMO_ACCESS_KEY: Joi.string().optional(),
  MOMO_SECRET_KEY: Joi.string().optional(),

  // Frontend URL for CORS
  FRONTEND_URL: Joi.string().default('http://localhost:5173'),
});
