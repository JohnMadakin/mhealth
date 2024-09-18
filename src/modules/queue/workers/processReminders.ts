import moment from 'moment';
import reminders from '../../reminder/models/reminder';
import { calculateNextReminderAt } from '../../reminder/reminder.service';
import { addJobsToQueue } from '../queue.service';


export default async function processReminders(job: any) {
  //send push notification
  const reminder = await reminders.findOne({
    where: {
      id: job.reminderId,
      isActive: true,
    }
  });
  if(!reminder) return null;
  let delay, isActive;
const nextReminderAt = reminder.frequency === 'none' 
  ? undefined 
    : calculateNextReminderAt(reminder.frequency,  reminder.reminderTime, reminder.timezone);
  
    if(nextReminderAt) {
    isActive = true;
    delay = moment(reminder.nextReminderAt).diff(moment());
    if(delay > 0) {
      addJobsToQueue({ worker: 'processReminders', delay, data: { reminderId: reminder.id }});
    }
  } else {
    isActive = false;
  }


  await reminder.update({ nextReminderAt, isActive });
  // send push notification
}
