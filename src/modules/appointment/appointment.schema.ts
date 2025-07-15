import { z } from "zod";


export const CreateAppointmentSchema = z.object({
  startDate: z.string({
    required_error: 'A data de início é obrigatória.',
    invalid_type_error: 'A data de início deve ser uma string.',
  }),
  client: z.object({
    name: z.string({
      required_error: 'O nome do cliente é obrigatório.',
      invalid_type_error: 'O nome do cliente deve ser uma string.',
    }),
    email: z.string({
      required_error: 'O email do cliente é obrigatório.',
      invalid_type_error: 'O email deve ser uma string.',
    }).email('O email inserido não é válido.'),
    phone: z.string().optional(),
    notes: z.string().optional(),
  }),
  collaboratorId: z.number({
    required_error: 'O ID do colaborador é obrigatório.',
    invalid_type_error: 'O ID do colaborador deve ser um número.',
  }),
  service: z.object({
    id: z.number({
      required_error: 'O ID do serviço é obrigatório.',
      invalid_type_error: 'O ID do serviço deve ser um número.',
    }),
  }),
});


// Export the inferred type
export type CreateAppointmentFormData = z.infer<typeof CreateAppointmentSchema>;
