import prisma from "../../libs/prisma";
import type { UpdateScheduleStoreFormData } from "../shop/schema/update-schedule.schema";
import type { CalendarEvent } from "./calendar.controller";
import type { CreateEventFormData } from "./schema/create-appointment";
import type { UpdatePositionAppointmentSchemaProps } from "./schema/update-position.schema";
import type { AppointmentType } from "./types/appointment.type";




export async function GetCalendar(storeId: number, startDate: Date, endDate: Date) {
  return await prisma.appointment.findMany({
    where: {
      shopId: storeId,
      start: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      id: true,
      start: true,
      end: true,
      duration: true,
      Client: {
        select: {
          id: true,
          name: true,
          email: true,
          notes: true,
          phone: true,
        }
      },
      Service: {
        select: {
          id: true,
          name: true,
          description: true,
          color: true,
        }
      }
    }
  })
}




export async function UpdateCalendarEvent(storeId: number, data: CalendarEvent) {
  return await prisma.appointment.update({
    where: {
      id: Number(data.id),
      shopId: storeId,
    },
    data: {
      start: data.start,
      end: data.end,
    }
  })
}

export async function UpdatePositionAppointment(storeId: number, id: number, data: UpdatePositionAppointmentSchemaProps) {
  return await prisma.appointment.update({
    where: {
      id,
      shopId: storeId,
    },
    data: {
      start: data.start,
      end: data.end,
    }
  })
}

export async function CreateAppointment(storeId: number, data: AppointmentType, dataProps: CreateEventFormData) {
  return await prisma.appointment.create({
    data: {
      Shop: {
        connect: {
          id: storeId
        }
      },
      User: {
        connect: {
          id: data.collabId
        }
      },
      Client: {
        connectOrCreate: {
          where: {
            email: dataProps.Client.email
          },
          create: {
            name: dataProps.Client.name,
            email: dataProps.Client.email,
            notes: dataProps.Client.notes,
            updatedAt: new Date(),
            Shop: {
              connect: {
                id: storeId
              }
            }
          }
        }
      },
      Service: {
        connect: {
          id: data.serviceId,
        }
      },
      end: data.end,
      price: 15,
      duration: data.duration,
      start: data.start,
    }
  });
}

