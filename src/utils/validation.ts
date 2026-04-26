import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "El usuario es obligatorio."),
  password: z.string().min(1, "La contraseña es obligatoria."),
});

export const visitRecordSchema = z.object({
  identificationNumber: z.string().min(1, "El número de identificación es obligatorio."),
  firstName: z.string().min(1, "El primer nombre es obligatorio."),
  middleName: z.string().optional(),
  firstLastName: z.string().min(1, "El primer apellido es obligatorio."),
  secondLastName: z.string().optional(),
  fullName: z.string().optional(),
  visitReason: z.string().min(1, "El motivo de la visita es obligatorio."),
});
