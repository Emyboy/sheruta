import { z } from 'zod'
import { DocumentReference } from 'firebase/firestore'

export enum BookmarkType {
	requests = 'requests',
	listings = 'listings',
	profiles = 'profiles',
}

export const BookmarkDTO = z.object({
	uuid: z.string(),
	title: z.string(),
	object_type: z.enum([
		BookmarkType.requests,
		BookmarkType.listings,
		BookmarkType.profiles,
	]),
	_object_ref: z.custom<DocumentReference | undefined>(
		(val) => val instanceof DocumentReference,
		{
			message: 'Must be a DocumentReference',
		},
	),
	_user_ref: z.custom<DocumentReference | undefined>(
		(val) => val instanceof DocumentReference,
		{
			message: 'Must be a DocumentReference',
		},
	),
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
	_object_ref: {
		id: string
	}
}
