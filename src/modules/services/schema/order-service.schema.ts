import { z } from "zod";


export const updateOrderSchema = z.array(z.number().int().positive())
    .min(1, 'Array deve ter pelo menos 1 ID')
    .max(1000, 'Máximo de 1000 itens por vez')