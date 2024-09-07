import moment from 'moment';
import medications from '../../medications/model/medications';
import { addJobsToQueue } from '../queue.service';


export default async function medicationReminder(job: any) {
  //send push notification
  const medication = await medications.findOne({
    where: {
      id: job.medicationId,
    }
  });
  if(!medication) return null;

  const nextDose = moment(medication.nextDose).add(medication.frequency, 'hours').toDate();
  await medication.update({ nextDose, });
  await addJobsToQueue({
    worker: 'medicationReminder',
    delay: medication.frequency * 60 * 60 * 1000,
    data: { medicationId: medication.id }
  });
  // send push notification
}
