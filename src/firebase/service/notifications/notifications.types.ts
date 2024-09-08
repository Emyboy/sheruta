import { DocumentReference, Timestamp } from 'firebase/firestore'
import { z } from 'zod'

export const NotificationsDTO = z.object({
	type: z.enum([
		'message',
		'inspection',
		'missed_call',
		'call',
		'comment',
		'rescheduled',
		'profile_view',
		'cancelled',
	]),
	message: z.string(),
	sender_details: z.object({
		id: z.string(),
		first_name: z.string(),
		last_name: z.string(),
	}),
	recipient_id: z.string(),
	is_read: z.boolean().default(false),
})

export type NotificationsType = z.infer<typeof NotificationsDTO>

export type returnedNotifications = NotificationsType & {
	createdAt: Timestamp
	deleteDate: Timestamp
	updatedAt: Timestamp
	id: string
	ref: DocumentReference
}
