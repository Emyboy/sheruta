import { DocumentReference, Timestamp } from 'firebase/firestore'
import { z } from 'zod'
import { AuthUser } from '../auth/auth.types'
import { FlatShareProfileData } from '../flat-share-profile/flat-share-profile.types'
import { UserInfo } from '../user-info/user-info.types'

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

enum NotificationsTriggerType {
	DEFAULT = 'default',
	PROFILE_VIEW = 'profile_view',
	REQUEST_VIEW = 'request_view',
	CALL = 'call',
}

export type NotificationType = {
	_id: string
	trigger_type: NotificationsTriggerType
	seen: boolean
	message: string
	sender: AuthUser
	receiver: AuthUser
	receiver_flat_share_profile: FlatShareProfileData
	// receiver_user_settings:USerset
	receiver_user_info: UserInfo
}

export type returnedNotifications = NotificationsType & {
	createdAt: Timestamp
	deleteDate: Timestamp
	updatedAt: Timestamp
	id: string
	ref: DocumentReference
}
