import { BadRequestException } from "../commons/errors/custom.error";


export async function PriceToCentsUtil(price: number) {
    return price * 100;
}

export async function CentsToPriceUtil(price: number | undefined): Promise<number> {
  return price ? price / 100 : 0;
}