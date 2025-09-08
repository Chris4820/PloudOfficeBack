import type { NextFunction, Request, Response } from "express";
import { UpdateLastVisit } from "../client/client.service";
import { CreateAppointment, deleteAppointment, getAppointmentById, getAppointmentClient, updateAppointment, updateAppointmentStatus, updateAppointmentStatusByUUID } from "./appointment.service";
import { sendConfirmAppointment } from "../../commons/email/email.service";
import { getStoreByDomain } from "../shop/shop.service";
import prisma from "../../libs/prisma";
import { addMinutes, format } from "date-fns";
import { pt } from 'date-fns/locale';
import type { CreateEventFormData } from "../calendar/schema/create-appointment";
import type { AppointmentType } from "../calendar/types/appointment.type";
import { BadRequestException } from "../../commons/errors/custom.error";
import { AppointmentStatus } from "@prisma/client";
import type { EditEventFormData } from "./schema/update.schema";

type AppointmentProps = {
  startDate: Date,
  endDate: Date | undefined,
  storeDomain: string,
  client: {
    name: string,
    email: string,
    phone: string,
    notes?: string,
  },
  store: {
    id: number
  },
  collaboratorId: number,
  service: {
    id: number,
    duration: number,
    price: number,
  },
}

export async function CreateNewAppointmentExternalController(req: Request, res: Response, next: NextFunction) {
  //Cliente criou a marcção no template
  try {
    const data = req.body as AppointmentProps;
    console.log(data)

    const rawHeader = req.get('X-Site-Origin');
    const storeDomain = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;
    const store = await getStoreByDomain(storeDomain === 'localhost:3001' ? 'barber.ploudstore.com' : storeDomain);
    if (!store) {
      return res.status(400).json({ message: 'Essa loja não existe' })
    };

    const collaborator = await prisma.collaborator.findUnique({
      where: {
        shopId_userId: {
          shopId: store.id,
          userId: data.collaboratorId, // que neste caso é o userId
        },
      },
    });

    if (!collaborator) {
      return res.status(404).json({ message: 'Colaborador não encontrado' });
    }
    const service = await prisma.collaboratorService.findUnique({
      where: {
        collaboratorId_serviceId: {
          serviceId: data.service.id,
          collaboratorId: collaborator.id,
        },
        isActive: true,
      },
      select: {
        Service: {
          select: {
            id: true,
            name: true,
          }
        },
        duration: true,
        price: true,
      }
    })

    if (!service) {
      return res.status(400).json({ message: 'Esse serviço não existe' })
    }
    //Atualizar ou criar cliente e trazer o ID
    //const client = await upsertClient(store.id, data.client.name, data.client.email, data.client.notes, data.client.phone);
    const endDate = addMinutes(data.startDate, service.duration);
    const appointment = await CreateAppointment(
      store.id,
      {
        start: data.startDate,
        collabId: collaborator.id,
        duration: service.duration,
        end: endDate,
        serviceId: service.Service.id,
      },
      {
        Client: {
          name: data.client.name,
          email: data.client.email,
          notes: data.client.notes,
          phone: data.client.phone,
        },
      }
    )
    const formattedDate = format(new Date(data.startDate), "EEEE, dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
      locale: pt,
    });

    // Executar operações não críticas em paralelo
    await Promise.all([
      sendConfirmAppointment({
        userName: appointment.Client.name || "",
        email: appointment.Client.email || "",
        collaboratorName: "Christophe Teste",
        serviceName: service.Service.name || "Lavar os dentes",
        startDate: formattedDate,
        storeName: store.name || "Loja nome",
        cancelLink: `${storeDomain}/cancel?id=${appointment.uuid}`,
      }),
      UpdateLastVisit(appointment.Client.id, store.id, data.startDate),
    ]);

    return res.status(200).json({ message: 'Marcação criada com sucesso' })

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Marcação criada com sucesso' })
  }
}


export async function CreateNewAppoitmentInternalController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body as CreateEventFormData;

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

export async function GetAppointmentClientController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const appointments = await getAppointmentClient(Number(id), req.storeId)
    return res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
}


export async function GetAppointmentByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    console.log(id);
    const appointments = await getAppointmentById(Number(id), req.storeId)
    return res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
}


export async function UpdateAppointmentStatusController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status } = req.query;



    if (!status || !Object.values(AppointmentStatus).includes(status as AppointmentStatus)) {
      throw new BadRequestException("Status inválido");
    }

    await updateAppointmentStatus(Number(id), req.storeId, status as AppointmentStatus);
    return res.status(200).json({ message: 'Cancelado com sucesso' });
  } catch (error) {
    next(error);
  }
}

export async function DeleteAppointmentController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await deleteAppointment(Number(id), req.storeId)
    return res.status(203).json({ message: 'Ok' })
  } catch (error) {
    next(error);
  }
}

export async function UpdateAppointmentController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body as EditEventFormData;
    const { id } = req.params;
    const endDate = new Date(data.start);
    endDate.setMinutes(endDate.getMinutes() + data.duration); // N é o número de minutos a adicionar
    await updateAppointment(Number(id), req.storeId, data, endDate);
    return res.status(200).json({ message: 'OK' })
  } catch (error) {
    next(error);
  }
}


export async function CancelAppointmentExternalController(req: Request, res: Response, next: NextFunction) {
  try {
    const rawHeader = req.get('X-Site-Origin');
    const storeDomain = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;
    const store = await getStoreByDomain(storeDomain === 'localhost' ? 'barber.ploudstore.com' : storeDomain);
    if (!store) {
      return res.status(400).json({ message: 'Essa loja não existe' })
    };
    const { id } = req.query;
    if (!id || id === "" || typeof id !== "string") {
      throw new BadRequestException("ID é obrigatório");
    }
    console.log("Sim");
    console.log(store.id, id);
    await updateAppointmentStatusByUUID(store.id, id, AppointmentStatus.CANCELED);
    return res.status(200).json({ message: 'Cancelado com sucesso' });

  } catch (error) {
    console.log("Não")
    next(error);
  }
}
