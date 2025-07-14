import { z } from "zod";
import { shopScheduleSchema } from "../../../commons/schema/schedule.schema";



// Main product schema
export const UpdateScheduleStoreSchema = z.object({
  ShopSchedule:shopScheduleSchema,
});

// Export the inferred type
export type UpdateScheduleStoreFormData = z.infer<typeof UpdateScheduleStoreSchema>;