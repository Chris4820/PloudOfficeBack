"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
// utils/sendEmail.ts
const resend_1 = require("../../libs/resend");
const renderTemplate_1 = require("./utils/renderTemplate");
async function sendEmail({ to, subject, template, context }) {
    const html = await (0, renderTemplate_1.renderEmailTemplate)(template, context);
    const { data, error } = await resend_1.resend.emails.send({
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
//# sourceMappingURL=sendEmail.js.map