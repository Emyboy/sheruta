import { DocumentReference } from 'firebase/firestore'
import { z } from 'zod'
import { HostRequestData, SeekerRequestData } from '../request/request.types'
import { FlatShareProfileData } from '../flat-share-profile/flat-share-profile.types'

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
	_user_ref: z.custom<DocumentReference | undefined>(
		(val) => val instanceof DocumentReference,
		{
			message: 'Must be a DocumentReference',
		},
	),
	_object_ref: z.custom<DocumentReference | undefined>(
		(val) => val instanceof DocumentReference,
		{
			message: 'Must be a DocumentReference',
		},
	),
})

export type BookmarkData = z.infer<typeof BookmarkDTO>

interface ProfileDTO {
	_id: string
	avatar_url: string
	first_name: string
	last_name: string
	_user_ref: DocumentReference
	flat_share_profile: FlatShareProfileData
}

export type BookmarkDataDetails = Omit<BookmarkData, '_user_ref'> & {
	id: string
	_user_ref: {
		first_name: string
		last_name: string
		avatar_url: string
		_id: string
		email: string
	}
	_object_ref: SeekerRequestData | HostRequestData | ProfileDTO
}
