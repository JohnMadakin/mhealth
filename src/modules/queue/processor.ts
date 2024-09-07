import queueInstance from './index';

function processQueueItems() {
    queueInstance.process(async (job) => {
      const { worker, data } = job.data;

        // Dynamically load the correct service file
        try {
          const service = require(`./workers/${worker}`).default;
          await service(data);
        } catch (err) {
          console.error(`Failed to process job for service ${worker}`, err);
        }
    });

    queueInstance.on('error', function (error) {
      console.log(`REDIS QUEUE ERROR: `, error);
    });

    queueInstance.on('stalled', (job) => {
      console.log(`Job with id ${job?.id} stalled.`);
    });

    queueInstance.on('lock-extension-failed', function (job, err) {
      console.log(`LOCK EXTENSION FAILED FOR JOB ${job?.id}:`, err);
    });

    queueInstance.on('completed', function (job, result) {
      console.log(`Job with id ${job?.id} completed: `, result);
    });
    
    queueInstance.on('drained', function () {
      console.log('Jobs drained. no more jobs in the queue.');
    });

    queueInstance.on('paused', function () {
      console.log('The queue has been paused.');
    });

    queueInstance.on('failed', async function (job, err) {
      const jobId = job?.data?.queueEntryId;
      console.log(`Job with id  ${jobId} failed: `, err);
    });
}

export default processQueueItems;
