import { appConfig } from './config/app.config';
import app from './app';
import sequelize from './database/sequelize';

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    app.listen({ port: appConfig.port, host: '0.0.0.0' }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    console.log(`Server listening at ${address}`);
  });
  } catch (error) {
    console.log('🔥', error);
  }
}

start();