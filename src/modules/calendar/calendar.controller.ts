import type { NextFunction, Request, Response } from "express";
import { CreateAppointment, GetCalendar, UpdateCalendarEvent, UpdatePositionAppointment } from "./calendar.service";
import { endOfDay, isAfter, startOfDay } from "date-fns";
import type { GetEventsCalendarSchemaProps } from "./schema/get-calendar.schema";
import { BadRequestException } from "../../commons/errors/custom.error";
import type { UpdateScheduleStoreFormData } from "../shop/schema/update-schedule.schema";
import type { UpdatePositionAppointmentSchemaProps } from "./schema/update-position.schema";
import type { CreateEventFormData } from "./schema/create-appointment";
import type { AppointmentType } from "./types/appointment.type";




export async function GetCalendarController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body as GetEventsCalendarSchemaProps


    if (isAfter(data.start, data.end)) {
      throw new BadRequestException('Data de ínicio nao pode ser depois da data de fim');
    }

    const appointment = await GetCalendar(1, new Date(data.start), new Date(data.end));
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

export async function CreateAppoitmentController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body as CreateEventFormData;

    console.log("Començando em: " + data.start);

    const endDate = new Date(data.start);
    endDate.setMinutes(endDate.getMinutes() + data.duration); // N é o número de minutos a adicionar

    const CreateAppointmentProps: AppointmentType = {
      collabId: data.collabId,
      duration: data.duration,
      end: endDate,
      start: data.start,
      serviceId: data.serviceId,
    }
    await CreateAppointment(req.storeId, CreateAppointmentProps, data);
    return res.status(201).json({ message: 'Ok' });
  } catch (error) {
    next(error);
  }
}