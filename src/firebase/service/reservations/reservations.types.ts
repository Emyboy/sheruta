import { Timestamp } from 'firebase/firestore'
import { z } from 'zod'

export const ReservationDTO = z.object({
	uuid: z.string(),
	request_id: z.string(),
	reserved_by: z.string(),
	startTime: z.instanceof(Timestamp),
	endTime: z.instanceof(Timestamp),
})

export type ReservationType = z.infer<typeof ReservationDTO>
