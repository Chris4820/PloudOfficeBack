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
  console.log("Novo UUID", data.cancelLink);
  return sendEmail({
    to: data.email,
    subject: `Marcação concluída - ${data.storeName}`,
    template: "appointmentConfirmed",
    context: {
      data
    },
  });
}


type sendRecoveryPasswordProps = {
  userName: string,
  email: string,
  verificationLink: string
}

// emails/sendRecoveryPassword.ts
export function sendRecoveryPassword(data: sendRecoveryPasswordProps) {

  return sendEmail({
    to: data.email,
    subject: "Recuperação de palavra-passe - PloudStore",
    template: "resetPassword",
    context: {
      data
    },
  });
}
