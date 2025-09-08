import type { AppointmentStatus } from "@prisma/client";
import prisma from "../../libs/prisma";
import type { CreateEventFormData } from "../calendar/schema/create-appointment";
import type { AppointmentType } from "../calendar/types/appointment.type";
import type { EditEventFormData } from "./schema/update.schema";


export async function createBooking(
  start: Date,
  end: Date,
  shopId: number,
  collabId: number,
  clientId: number,
  duration: number,
  serviceId: number,
  price: number,
) {
  return await prisma.appointment.create({
    data: {
      start: start,
      shopId,
      collaboratorId: collabId,
      clientId,
      end: end,
      duration,
      price,
      serviceId,
    },
    select: {
      uuid: true,
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
            shopId_email: {
              shopId: storeId,
              email: dataProps.Client.email,
            },
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
    },
    select: {
      uuid: true,
      Client: {
        select: {
          id: true,
          name: true,
          email: true,
        }

      }
    }
  });
}


export async function getAppointmentClient(clientId: number, shopId: number) {
  return await prisma.appointment.findMany({
    where: {
      shopId,
      clientId,
    },
    select: {
      id: true,
      start: true,
      duration: true,
      price: true,
      createdAt: true,
      User: {
        select: {
          id: true,
          name: true,
        }
      }
    },
    take: 5,
  })
}

export async function getAppointmentById(appointmentId: number, shopId: number) {
  return await prisma.appointment.findUnique({
    where: {
      shopId,
      id: appointmentId,
    },
    select: {
      id: true,
      notes: true,
      status: true,
      Client: {
        select: {
          id: true,
          name: true,
          notes: true,
          email: true,
          phone: true,
        }
      },
      Service: {
        select: {
          id: true,
          name: true,
        }
      },
      start: true,
      duration: true,
      price: true,
      createdAt: true,
      User: {
        select: {
          id: true,
          name: true,
        }
      }
    },
  })
}

export async function updateAppointmentStatus(appointmentId: number, storeId: number, status: AppointmentStatus) {
  return await prisma.appointment.update({
    where: {
      id: appointmentId,
      shopId: storeId,
    },
    data: {
      status,
    }
  })
}

export async function deleteAppointment(appointmentId: number, storeId: number) {
  return await prisma.appointment.delete({
    where: {
      id: appointmentId,
      shopId: storeId
    }
  })
}

export async function updateAppointment(appoinmentId: number, storeId: number, data: EditEventFormData, endDate: Date) {
  return await prisma.appointment.update({
    where: {
      id: appoinmentId,
      shopId: storeId,
    },
    data: {
      serviceId: data.serviceId,
      collaboratorId: data.collabId,
      start: data.start,
      end: endDate,
      duration: data.duration,
    },
  })
}

export async function updateAppointmentStatusByUUID(storeId: number, uuid: string, status: AppointmentStatus) {
  return await prisma.appointment.update({
    where: {
      uuid,
      shopId: storeId,
    },
    data: {
      status,
    }
  })
}