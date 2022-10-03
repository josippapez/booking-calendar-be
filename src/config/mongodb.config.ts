import { registerAs } from '@nestjs/config';

const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * Mongo database connection config
 */
export default registerAs('mongodb', () => {
  const {
    AUTH_SOURCE,
    MONGO_PORT,
    MONGO_CONTAINER_HOSTNAME,
    MONGO_DATABASE,
    MONGO_USERNAME,
    MONGO_PASSWORD,
  } = process.env;
  return {
    uri: `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CONTAINER_HOSTNAME}:${MONGO_PORT}/${MONGO_DATABASE}?authSource=${AUTH_SOURCE}`,
  };
});
