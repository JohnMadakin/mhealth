import queueInstance from './index';
import { appConfig } from '../../config/app.config';

export function addJobsToQueue(job: { worker: string; data: any, delay?: number }) {
  if (queueInstance) {
    queueInstance.add(
      { worker: job.worker, data: job.data },
      {
        delay: job.delay || 100,
        removeOnComplete: {
          age: (Number(appConfig.jobRemovalTime) || 1) * 3600,
        },
      }
    );
  } else {
    throw new Error('no queue instantiated.')
  }
}

export function processJobs() {
  // queueInstance.process();
}

