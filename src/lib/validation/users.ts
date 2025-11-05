import { z } from "zod";

export const userProfileUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters long." })
    .max(120, { message: "Name must not exceed 120 characters." }),
  college_name: z
    .string()
    .trim()
    .min(2, { message: "College name must be at least 2 characters." })
    .max(150, { message: "College name must not exceed 150 characters." }),
  branch: z
    .string()
    .trim()
    .min(2, { message: "Branch must be at least 2 characters." })
    .max(120, { message: "Branch must not exceed 120 characters." }),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, {
      message: "Phone number must be a valid 10 digit number."
    }),
  year_of_study: z
    .string()
    .trim()
    .min(2, { message: "Year of study must be at least 2 characters." })
    .max(50, { message: "Year of study must not exceed 50 characters." })
});

export type UserProfileUpdateInput = z.infer<typeof userProfileUpdateSchema>;
