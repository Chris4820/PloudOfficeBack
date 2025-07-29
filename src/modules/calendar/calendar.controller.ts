import type { NextFunction, Request, Response } from "express";
import { GetCalendar, UpdateCalendarEvent, UpdatePositionAppointment } from "./calendar.service";
import { endOfDay, isAfter, startOfDay } from "date-fns";
import type { GetEventsCalendarSchemaProps } from "./schema/get-calendar.schema";
import { BadRequestException } from "../../commons/errors/custom.error";
import type { UpdatePositionAppointmentSchemaProps } from "./schema/update-position.schema";



//Controllers para o calendário
export async function GetCalendarController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body as GetEventsCalendarSchemaProps


    if (isAfter(data.start, data.end)) {
      throw new BadRequestException('Data de ínicio nao pode ser depois da data de fim');
    }

    const appointment = await GetCalendar(req.storeId, new Date(data.start), new Date(data.end));
    return res.status(200).json(appointment)
  } catch (error) {
    next(error)
  }
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  Service: {
    id: string,
    name: string,
  },
  Clients: {
    id: number;
    notes?: string;
    name: string;
    email?: string;
    phone?: string;
  };
}

export async function UpdateCalendarController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body as CalendarEvent;

    console.log(data);

    await UpdateCalendarEvent(req.storeId, data);
    return res.status(200).json({ message: 'Ok' })
  } catch (error) {
    next(error);
  }
}


export async function UpdatePositionAppointmentController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body as UpdatePositionAppointmentSchemaProps;
    await UpdatePositionAppointment(req.storeId, Number(req.params.id), data);
    if (data.notificationClient) {
      //Notificar cliente por email da mudança
    }
    return res.status(200).json({ message: 'Ok' })
  } catch (error) {
    next(error);
  }
}