import { z } from 'zod';
import type { Application } from './types';

/**
 * Zod schema for the application Status type.
 */
export const statusSchema = z.enum(['applied', 'interview', 'offer', 'rejected']);

/**
 * Zod schema for a single Application.
 *
 * - Required fields: id, company, role, status, appliedAt, order
 * - Optional fields: location, salary, link, notes, followUpAt
 * - `link` is validated as a URL when provided
 * - `appliedAt` and `followUpAt` are validated as ISO date-time strings
 */
export const applicationSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role is required'),
  status: statusSchema,
  location: z.string().optional(),
  salary: z.string().optional(),
  link: z.url('Must be a valid URL').optional(),
  notes: z.string().optional(),
  appliedAt: z.iso.datetime({ message: 'Must be a valid ISO date-time' }),
  followUpAt: z.iso.datetime({ message: 'Must be a valid ISO date-time' }).optional(),
  order: z.number().int().min(0, 'Order must be a non-negative integer'),
});

/**
 * Schema for validating an array of applications (e.g. JSON import).
 */
export const applicationsArraySchema = z.array(applicationSchema);

/**
 * Schema for the form input when creating/editing an application.
 * Omits `id` and `order` since those are generated programmatically.
 */
export const applicationFormSchema = applicationSchema.omit({
  id: true,
  order: true,
});

/**
 * Inferred type from the form schema — useful for form state.
 */
export type ApplicationFormData = z.infer<typeof applicationFormSchema>;

/**
 * Type guard: validates unknown data against the Application schema.
 */
export function isValidApplication(data: unknown): data is Application {
  return applicationSchema.safeParse(data).success;
}
