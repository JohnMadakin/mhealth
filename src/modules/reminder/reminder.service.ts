import joi from 'joi';
import moment from 'moment';
import 'moment-timezone';
import { ErrorResponse } from '../../utils';
import { CustomError } from 'types/error.type';
import { validateSpec } from '../../utils';
import Reminder, { ReminderAttributes } from './models/reminder';
import Patient from '../../modules/patients/models/patients';
import { Frequency } from 'types';
import TrackingData from '../diseases/models/tracking.data';
import { addJobsToQueue } from '../queue/queue.service';

const timeSchema = joi.string()
  .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
  .required()
  .messages({
    'string.pattern.base': 'Time must be in HH:mm format (e.g., 17:59).',
    'string.empty': 'Time is required.',
  });


const spec = joi.object({
  trackingDataId: joi.number().required(),
  name: joi.string().max(120).required(),
  description: joi.string().max(120),
  reminderTime: timeSchema,
  timezone: joi.string().default('UTC'),
  frequency: joi.string().valid(
    'daily', 'weekly', 'monthly', 'yearly', 'saturday', 'sunday',
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'none'
    ).required(),
  authId: joi.string().uuid(),
});
export const createNewReminder = async (data: any): Promise<ReminderAttributes> => {
  try {
    const params = validateSpec<ReminderAttributes & { authId: string; }>(spec, data);
    console.log('params => ', params)
    const [patient, trackingData] = await Promise.all([
      Patient.findOne({ where: { authId: params.authId }}),
      TrackingData.findByPk(params.trackingDataId),
    ]);

    if(!patient) throw new Error('No patient found.');
    if(!trackingData) throw new Error('invalid tracking data id.');

    const nextReminderAt = params.frequency === 'none' 
      ? undefined 
        : calculateNextReminderAt(params.frequency,  params.reminderTime, params.timezone);

    const reminder = await Reminder.create({
      patientId: patient.id,
      description: params.description,
      name: params.name,
      timezone: params.timezone,
      frequency: params.frequency,
      reminderTime: params.reminderTime,
      nextReminderAt,
      trackingDataId: params.trackingDataId,
    });

    const delay = moment(params.reminderTime, 'HH:mm').diff(moment());
    if(delay > 0) {
      addJobsToQueue({ worker: 'processReminders', delay, data: { reminderId: reminder.id }});
    }
    return reminder;
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
};

export function calculateNextReminderAt(frequency: Frequency, reminderTime: string, timezone: string): Date {
  const currentDate = moment().tz(timezone); // Get the current time in the specified timezone
  // console.log('==> ', currentDate, parseInt(reminderTime.split(":")[0], 10), parseInt(reminderTime.toISOString().split(":")[1], 10));
  let nextReminderDate = moment(currentDate).set({
    hour: parseInt(reminderTime.split(":")[0], 10),
    minute: parseInt(reminderTime.split(":")[1], 10),
    second: 0,
    millisecond: 0
  });
  console.log('nextReminderDate ==> ', nextReminderDate)

  switch (frequency?.toLowerCase()) {
    case 'daily':
      nextReminderDate.add(1, 'days'); // Add one day for daily reminders
      break;
    case 'weekly':
      nextReminderDate.add(1, 'weeks'); // Add one week for weekly reminders
      break;
    case 'monthly':
      nextReminderDate.add(1, 'months'); // Add one month for monthly reminders
      break;
    case 'yearly':
      nextReminderDate.add(1, 'years'); // Add one year for yearly reminders
      break;
    case 'monday':
    case 'tuesday':
    case 'wednesday':
    case 'thursday':
    case 'friday':
    case 'saturday':
    case 'sunday':
      nextReminderDate = getNextDayOfWeek(currentDate, frequency, reminderTime);
      break;
    default:
      throw new Error('Invalid frequency provided');
  }

  return nextReminderDate.toDate();  // Return the next reminder date as a JavaScript Date object
}

function getNextDayOfWeek(currentDate: moment.Moment, targetDay: Frequency, reminderTime: string): moment.Moment {
  if(!targetDay) throw new Error('Invalid frequency provided');
  const daysOfWeek: { [key: string]: number } = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const targetDayNumber = daysOfWeek[targetDay.toLowerCase()];
  const currentDayNumber = currentDate.day();

  let diff = targetDayNumber - currentDayNumber;
  if (diff <= 0) {
    diff += 7; // Add 7 to get the next occurrence of the target day
  }
  console.log('🍊', diff)
  return currentDate.clone().add(diff, 'days').set({
    hour: parseInt(reminderTime.split(":")[0], 10),
    minute: parseInt(reminderTime.split(":")[1], 10),
    second: 0,
    millisecond: 0
  });
}

export const getAllReminders = async (authId: string): Promise<ReminderAttributes[]> => {
  try {
    const patient =  await Patient.findOne({ where: { authId }});

    if(!patient) throw new Error('No patient found.');
  
    const reminders = await Reminder.findAll({
       where: {
        patientId: patient.id
       }
    });
    return reminders;
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
};