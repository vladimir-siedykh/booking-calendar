import { z } from 'zod';

export const bookingSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  notes: z
    .string()
    .min(1, 'Please tell us about your project')
    .min(10, 'Message must be at least 10 characters'),
  guests: z
    .array(z.string().email('Please enter valid email addresses'))
    .optional(),
  referralSource: z
    .enum(['google', 'twitter', 'instagram', 'facebook'])
    .optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;