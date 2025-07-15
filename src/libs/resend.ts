import { Resend } from "resend";


// Initialize Resend with your API key
export const resend = new Resend("re_RztjGnvk_QAtQwM7mYy4v988PMsPywiDe");

resend.domains.create({ name: 'no-reply.ploudoffice.com' });