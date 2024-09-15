import { DocumentReference } from 'firebase/firestore'
import { z } from 'zod'

export enum BookmarkType {
	requests = 'requests',
	listings = 'listings',
	profiles = 'profiles',
}

export const BookmarkDTO = z.object({
	uuid: z.string(),
	object_type: z.enum([
		BookmarkType.requests,
		BookmarkType.listings,
		BookmarkType.profiles,
	]),
	_object_ref: z
		.custom<DocumentReference | undefined>(
			(val) => val instanceof DocumentReference,
			{
				message: 'Must be a DocumentReference',
			},
		)
		.optional(),
	_user_ref: z.custom<DocumentReference | undefined>(
		(val) => val instanceof DocumentReference,
		{
			message: 'Must be a DocumentReference',
		},
	),
	request_id: z.string(),
})

export type BookmarkData = z.infer<typeof BookmarkDTO>

export type BookmarkDataDetails = Omit<BookmarkData, '_user_ref'> & {
	id: string
	_user_ref: {
		first_name: string
		last_name: string
		avatar_url: string
		_id: string
		email: string
	}
	object_type: BookmarkType
	_object_ref:
		| {
				id: string
		  }
		| undefined
	request_id: string
}
