"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendConfirmAppointment = sendConfirmAppointment;
exports.sendRecoveryPassword = sendRecoveryPassword;
const sendEmail_1 = require("./sendEmail");
function sendConfirmAppointment(data) {
    console.log("Novo UUID", data.cancelLink);
    return (0, sendEmail_1.sendEmail)({
        to: data.email,
        subject: `Marcação concluída - ${data.storeName}`,
        template: "appointmentConfirmed",
        context: {
            data
        },
    });
}
// emails/sendRecoveryPassword.ts
function sendRecoveryPassword(data) {
    return (0, sendEmail_1.sendEmail)({
        to: data.email,
        subject: "Recuperação de palavra-passe - PloudStore",
        template: "resetPassword",
        context: {
            data
        },
    });
}
//# sourceMappingURL=email.service.js.map