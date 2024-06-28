import { z } from 'zod'

export const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Name must be at least 1 characters.',
    })
    .max(24, {
      message: 'Name cannot exceed 24 characters.',
    }),
  symbol: z
    .string()
    .length(1, { message: 'Symbol must be a single character.' }),
  premine: z.string(),
  amount: z.string().min(0, { message: 'Amount is required.' }),
  cap: z.string().min(0, { message: 'Cap is required.' }),
  divisibility: z
    .string()
    .max(38, { message: 'Divisibility cannot be higher than 38.' }),
  address: z
    .string()
    .length(42, { message: 'Address cannot exceed 42 characters.' }),
})

export const formSchemaRuneToBTC = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Name must be at least 1 characters.',
    })
    .max(24, {
      message: 'Name cannot exceed 24 characters.',
    }),
  amount: z.string().min(0, { message: 'Amount is required.' }),
  address: z
    .string()
    .length(62, { message: 'Address cannot exceed 62 characters.' }),
})
