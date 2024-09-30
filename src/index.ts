import { appConfig } from './config/app.config';
import createApp from './app';
import sequelize from './database/sequelize';
import processQueueItems from './modules/queue/processor';

async function start() {
  try {
    console.log('🍎', appConfig.environment)
    const app = await createApp();
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    if(appConfig.isWorker) {
      processQueueItems();
    }
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
