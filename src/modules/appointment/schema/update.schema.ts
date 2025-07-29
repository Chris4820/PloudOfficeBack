import { z } from "zod";

export const editEventSchema = z.object({
  start: z.string({
    required_error: "Data e hora da marcação obrigatória.",
    invalid_type_error: "Data da marcação inválida.",
  }),
  duration: z
    .number({ invalid_type_error: "Duração inválida.", message: "Duração obrigatória." })
    .min(1, { message: "Defina uma duração válida." }),
  serviceId: z.number({
    required_error: "Selecione um serviço.",
    invalid_type_error: "Serviço inválido.",
  }).min(1, "Colaborador obrigatório"),
  collabId: z.number({
    required_error: "Colaborador obrigatório.",
    invalid_type_error: "Colaborador inválido.",
  }).min(1, "Colaborador obrigatório"),
});

export type EditEventFormData = z.infer<typeof editEventSchema>;