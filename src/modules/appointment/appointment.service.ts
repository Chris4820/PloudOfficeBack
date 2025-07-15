import prisma from "../../libs/prisma";


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