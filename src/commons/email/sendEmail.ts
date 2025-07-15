// utils/sendEmail.ts
import { resend } from "../../libs/resend";
import { renderEmailTemplate } from "./utils/renderTemplate";

type SendEmailParams = {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
};

export async function sendEmail({ to, subject, template, context }: SendEmailParams) {
  const html = await renderEmailTemplate(template, context);

  const { data, error } = await resend.emails.send({
    from: 'PloudStore <no-reply@ploudstore.com>',
    to,
    subject,
    html,
  });

  if (error) {
    console.error("Erro ao enviar e-mail:", error);
    throw error;
  }

  return data;
}
