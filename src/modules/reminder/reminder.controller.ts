import { FastifyRequest, FastifyReply, RouteHandlerMethod } from 'fastify';
import { ErrorResponse, SuccessResponse } from '../../utils/response';
import { createNewReminder, getAllReminders } from './reminder.service';
import { CustomError } from '../../types';
import { ReminderAttributes } from './models/reminder';

export const logReminders: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    if(!req.session) throw new Error('No session available.');
    const data = req.body as ReminderAttributes;

    const result = await createNewReminder({...data, authId: req.session.id });
    let message = 'Reminder created.';
    return reply.send(new SuccessResponse(message, result || null));
  } catch (error) {
    const e = error as CustomError;
    return reply.status(e.errorCode).send(new ErrorResponse(e.message, e.errorCode));
  }
};

export const fetchReminders: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    if(!req.session) throw new Error('No session available.');

    const result = await getAllReminders(req.session.id);
    let message = 'Reminders fetched.';
    return reply.send(new SuccessResponse(message, result || null));
  } catch (error) {
    const e = error as CustomError;
    return reply.status(e.errorCode).send(new ErrorResponse(e.message, e.errorCode));
  }
};
