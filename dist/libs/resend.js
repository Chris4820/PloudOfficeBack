"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resend = void 0;
const resend_1 = require("resend");
// Initialize Resend with your API key
exports.resend = new resend_1.Resend("re_RztjGnvk_QAtQwM7mYy4v988PMsPywiDe");
exports.resend.domains.create({ name: 'no-reply.ploudoffice.com' });
//# sourceMappingURL=resend.js.map