import { z } from "zod";
export const VehicleCreate = z.object({ registration: z.string().min(3) });
export type VehicleCreate = z.infer<typeof VehicleCreate>;
