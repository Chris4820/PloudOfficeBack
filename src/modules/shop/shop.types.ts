import type { DayOfWeek } from "@prisma/client"
import type { shopScheduleFormData } from "../../commons/schema/schedule.schema"


export enum ShopTypeEnum {
  RESTAURANT = "restaurant",
  BARBER = "barber",
  SALON = "salon",
}


export type CreateShopProps = {
  name: string,
  subdomain: string,
  shopType: ShopTypeEnum,
  phone: string,
  email: string,
  address: string,
  shortName: string,
}