import type { NextFunction, Request, Response } from "express";
import { upsertClient } from "../client/client.service";
import { createBooking } from "./appointment.service";
import { sendConfirmAppointment } from "../../commons/email/email.service";
import { getStoreByDomain } from "../shop/shop.service";
import prisma from "../../libs/prisma";
import { addMinutes, format } from "date-fns";
import { pt } from 'date-fns/locale';

type AppointmentProps = {
  startDate: Date,
  endDate: Date | undefined,
  storeDomain: 'barber.ploudoffice.com',
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
  console.log("Bateu");
  //Cliente criou a marcção no template
  try {
    const data = req.body as AppointmentProps;
    console.log(data)

    const rawHeader = req.get('X-Site-Origin');
    const storeDomain = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;
    if (!storeDomain) {
      return res.status(200).json({ message: 'Loja não conhecida' })
    };
    const store = await getStoreByDomain('barber.ploudoffice.com');
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
    console.log(service);

    if (!service) {
      return res.status(400).json({ message: 'Esse serviço não existe' })
    }
    //Atualizar ou criar cliente e trazer o ID
    const client = await upsertClient(store.id, data.client.name, data.client.email, data.client.notes, data.client.phone);
    const endDate = addMinutes(data.startDate, service.duration);
    const appointment = await createBooking(
      data.startDate,
      endDate,
      store.id,
      collaborator.id,
      client.id,
      service.duration,
      service.Service.id,
      service.price,
    )
    const formattedDate = format(new Date(data.startDate), "EEEE, dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
      locale: pt,
    });
    sendConfirmAppointment({
      userName: client.name || "",
      email: client.email || "",
      collaboratorName: "Christophe Teste",
      serviceName: service.Service.name || "Lavar os dentes",
      startDate: formattedDate,
      storeName: store.name || "Loja nome",
      cancelLink: appointment.uuid || "",

    })

    return res.status(200).json({ message: 'Marcação criada com sucesso' })

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Marcação criada com sucesso' })
  }
}