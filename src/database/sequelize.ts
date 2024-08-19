import { Sequelize } from 'sequelize';
import { appConfig } from '../config/app.config';

const { environment } = appConfig;

const dbConfig = appConfig[environment] as {
  dbUser: string;
  dbPass: string;
  dbName: string;
  dbHost: string;
};
// Create a new instance of Sequelize
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: dbConfig.dbHost,
  username: dbConfig.dbUser,
  password: dbConfig.dbPass,
  database: dbConfig.dbName,
  logging: true,
  pool: {
    max: 10, // Maximum number of connections in the pool
    min: 0, // Minimum number of connections in the pool
    acquire: 30000, // Maximum time, in milliseconds, that pool will try to get a connection before throwing an error
    idle: 10000, // Maximum time, in milliseconds, that a connection can be idle before being released
  },
});

export default sequelize;
