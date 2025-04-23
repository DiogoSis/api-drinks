import { config } from 'dotenv';

config();

export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-key-for-development',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  bcrypt: {
    saltRounds: 10
  }
};

export const dbConfig = {
  url: process.env.DATABASE_URL,
  maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10)
};

export const serverConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  env: process.env.NODE_ENV || 'development',
  apiPrefix: '/v1'
};

export const config = {
  auth: authConfig,
  db: dbConfig,
  server: serverConfig
};
