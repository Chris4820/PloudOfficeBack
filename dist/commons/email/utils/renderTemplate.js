"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderEmailTemplate = renderEmailTemplate;
const nunjucks_1 = __importDefault(require("nunjucks"));
function renderEmailTemplate(templateName, context) {
    return new Promise((resolve, reject) => {
        console.log("CONTEXT", context);
        nunjucks_1.default.render(`emails/${templateName}.njk`, context.data, (err, result) => {
            if (err)
                return reject(err);
            resolve(result);
        });
    });
}
//# sourceMappingURL=renderTemplate.js.map