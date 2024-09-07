import BullQueue from 'bull';
import { appConfig } from '../../config/app.config';

export default new BullQueue("mhealth-reminders", appConfig.redisQueueUrl);
