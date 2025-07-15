"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateScheduleStoreSchema = void 0;
const zod_1 = require("zod");
const schedule_schema_1 = require("../../../commons/schema/schedule.schema");
// Main product schema
exports.UpdateScheduleStoreSchema = zod_1.z.object({
    ShopSchedule: schedule_schema_1.shopScheduleSchema,
});
//# sourceMappingURL=update-schedule.schema.js.map