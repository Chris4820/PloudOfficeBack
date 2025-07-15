"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendConfirmAppointment = sendConfirmAppointment;
exports.sendRecoveryPassword = sendRecoveryPassword;
const sendEmail_1 = require("./sendEmail");
function sendConfirmAppointment(data) {
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
function sendRecoveryPassword(email, userName, link) {
    return (0, sendEmail_1.sendEmail)({
        to: email,
        subject: "Recuperação de palavra-passe - PloudStore",
        template: "recoverPassword",
        context: {
            userName,
            verificationLink: link,
        },
    });
}
//# sourceMappingURL=email.service.js.map