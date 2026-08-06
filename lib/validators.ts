import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const createUserSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-z0-9._]+$/,
      "Username can only contain letters, numbers, dots and underscores"
    ),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().trim().min(1, "Name is required").max(60),
});

export const createDonationSchema = z
  .object({
    donorName: z.string().trim().min(1, "Donor name is required").max(80),
    street: z.string().trim().min(1, "Street is required").max(80),
    houseNo: z.string().trim().max(20).optional(),
    amount: z
      .number()
      .int("Amount must be a whole number")
      .min(1, "Minimum amount is ₹1")
      .max(100_000, "Maximum amount is ₹1,00,000"),
    mode: z.enum(["CASH", "UPI"]),
    mobile: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
      .optional(),
    anonymous: z.boolean().default(false),
    screenshotUrl: z.url("Invalid screenshot URL").optional(),
  })
  .refine((v) => v.mode === "UPI" || !v.screenshotUrl, {
    message: "Screenshots are only for UPI payments",
  });

export const updateDonationSchema = z
  .object({
    status: z.enum(["VERIFIED", "REJECTED"]).optional(),
    cashDeposited: z.literal(true).optional(),
  })
  .refine((v) => v.status !== undefined || v.cashDeposited !== undefined, {
    message: "Nothing to update",
  });

export const createExpenseSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(100),
  category: z
    .string()
    .trim()
    .min(2, "Category must be at least 2 characters")
    .max(40),
  size: z.enum(["MINOR", "MID", "MAJOR"]),
  amount: z
    .number()
    .int("Amount must be a whole number")
    .min(1, "Minimum amount is ₹1")
    .max(1_000_000, "Maximum amount is ₹10,00,000"),
  receiptUrl: z.url("Invalid receipt URL").optional(),
  notes: z.string().trim().max(500).optional(),
  spentOn: z.coerce.date().optional(),
});

export const updateExpenseSchema = createExpenseSchema
  .partial()
  .refine((v) => Object.values(v).some((x) => x !== undefined), {
    message: "Nothing to update",
  });

export const updateUserSchema = z
  .object({
    active: z.boolean().optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
  })
  .refine((v) => v.active !== undefined || v.password !== undefined, {
    message: "Nothing to update",
  });
