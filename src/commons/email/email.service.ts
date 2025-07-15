import { sendEmail } from "./sendEmail";

type sendConfirmAppointmentProps = {
  userName: string,
  email: string,
  serviceName: string
  collaboratorName: string
  storeName: string
  startDate: string,
  cancelLink: string,
}
export function sendConfirmAppointment(data: sendConfirmAppointmentProps) {
  return sendEmail({
    to: data.email,
    subject: `Marcação concluída - ${data.storeName}`,
    template: "appointmentConfirmed",
    context: {
      data
    },
  });
}

// emails/sendRecoveryPassword.ts
export function sendRecoveryPassword(email: string, userName: string, link: string) {
  return sendEmail({
    to: email,
    subject: "Recuperação de palavra-passe - PloudStore",
    template: "recoverPassword",
    context: {
      userName,
      verificationLink: link,
    },
  });
}
