import { z } from 'zod'
import { DocumentReference, Timestamp } from 'firebase/firestore'
import { HostRequestDataDetails } from '../request/request.types'

const timestampSchema = z.object({
	seconds: z.number().int().positive(),
	nanoseconds: z.number().int().nonnegative().max(999_999_999),
})

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
	object_id: z.string(),
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
	// createdAt: z.union([z.instanceof(Timestamp), timestampSchema]),
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
	_object_ref : {
		uuid: string
	}
}
