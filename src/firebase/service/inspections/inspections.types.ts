import { Timestamp } from 'firebase/firestore'
import { z } from 'zod'

export const InspectionDataSchema = z.object({
	inspection_type: z.enum(['virtual', 'physical']),
	inspection_date: z.instanceof(Timestamp),
	host_details: z.object({
		id: z.string(),
		first_name: z.string(),
		last_name: z.string(),
	}),
	seeker_details: z.object({
		id: z.string(),
		first_name: z.string(),
		last_name: z.string(),
	}),
	isCancelled: z.boolean(),
	hasOccured: z.boolean(),
	inspection_location: z.string(),
})

export type InspectionData = z.infer<typeof InspectionDataSchema>
