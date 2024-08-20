import { Timestamp } from 'firebase/firestore'
import { z } from 'zod'

export const InspectionDataSchema = z.object({
	inspection_type: z.enum(['virtual', 'physical']),
	inspection_date: z.instanceof(Timestamp),
	host_id: z.string(),
	seeker_id: z.string(),
})

export type InspectionData = z.infer<typeof InspectionDataSchema>
