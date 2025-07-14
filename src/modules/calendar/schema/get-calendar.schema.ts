import { z } from "zod";



export const GetEventsCalendarSchema = z.object({
  start: z.preprocess((val) => new Date(val as string), z.date({ message: 'Data inválida' })),
  end: z.preprocess((val) => new Date(val as string), z.date({ message: 'Data inválida' })),
});

export type GetEventsCalendarSchemaProps = z.infer<typeof GetEventsCalendarSchema>;