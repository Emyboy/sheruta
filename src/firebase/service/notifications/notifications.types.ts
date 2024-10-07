import { DocumentReference, Timestamp } from 'firebase/firestore'
import { z } from 'zod'

export const NotificationsDTO = z.object({
	type: z.enum([
		'message',
		'inspection',
		'comment_reply',
		'call',
		'comment',
		'rescheduled',
		'profile_view',
		'cancelled',
		'bookmark',
		'reservation',
		'background_check',
	]),
	message: z.string(),
	sender_details: z
		.object({
			id: z.string(),
			first_name: z.string(),
			last_name: z.string(),
			avatar_url: z.string(),
		})
		.nullable(),
	recipient_id: z.string(),
	is_read: z.boolean().default(false),
	action_url: z.string().optional(),
})

export type NotificationsType = z.infer<typeof NotificationsDTO>

export type returnedNotifications = NotificationsType & {
	createdAt: Timestamp
	deleteDate: Timestamp
	updatedAt: Timestamp
	id: string
	ref: DocumentReference
}
