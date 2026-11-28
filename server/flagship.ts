import { z } from 'zod'
import { MINI_CTF_SUBJECTS } from '@/types/api'

const IITP_EMAIL_PATTERN = /^[^\s@]+@iitp\.ac\.in$/i

export const flagshipRegistrationSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  rollNumber: z.string().trim().min(3).max(40).regex(/^[a-zA-Z0-9/_-]+$/),
  subject: z.enum(MINI_CTF_SUBJECTS),
  semester: z.coerce.number().int().min(1).max(7),
  mobileNumber: z.string().trim().regex(/^[6-9]\d{9}$/, {
    message: 'Must be a valid 10-digit Indian mobile number.',
  }),
  email: z.string().trim().email().refine((value) => IITP_EMAIL_PATTERN.test(value), {
    message: 'Must be a valid IIT Patna email address.',
  }),
  ctfdUsername: z.string().trim().min(3).max(64).regex(/^[a-zA-Z0-9_.-]+$/, {
    message: 'Use 3–64 letters, numbers, periods, hyphens, or underscores.',
  }),
}).strict()

