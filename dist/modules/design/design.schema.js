"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDesignSchema = void 0;
const zod_1 = require("zod");
// Main product schema
exports.UpdateDesignSchema = zod_1.z.object({
    primaryColor: zod_1.z.string(),
    secondaryColor: zod_1.z.string(),
    hasChangeLogoImage: zod_1.z.boolean(),
    imageLogo: zod_1.z.object({
        type: zod_1.z.string().optional(),
        size: zod_1.z.number().optional(),
    }).optional(),
    hasChangeBackgroundImage: zod_1.z.boolean(),
    imageBackground: zod_1.z.object({
        type: zod_1.z.string().optional(),
        size: zod_1.z.number().optional(),
    }).optional(),
});
//# sourceMappingURL=design.schema.js.map