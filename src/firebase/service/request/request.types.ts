import { DocumentReference, Timestamp } from 'firebase/firestore'
import { z } from 'zod'
import { AuthUser } from '../auth/auth.types'
import { FlatShareProfileData } from '../flat-share-profile/flat-share-profile.types'
import { UserInfoDTO } from '../user-info/user-info.types'
import { OptionType } from '@/context/options.context'

export interface LocationObject {
	formatted_address?: string
	geometry?: {
		location?: {
			lat: number
			lng: number
		}
	}
	[key: string]: any
}

export enum PaymentType {
	monthly = 'monthly',
	annually = 'annually',
	quarterly = 'quarterly',
	biannually = 'biannually',
	daily = 'daily',
}

export type AvailabilityStatus = 'available' | 'unavailable' | 'reserved'

const timestampSchema = z.object({
	seconds: z.number().int().positive(),
	nanoseconds: z.number().int().nonnegative().max(999_999_999),
})

export const createHostSpaceRequestDTO = z.object({
	description: z.string(),
	service_charge: z.number().nullable(),
	rent: z.number(),
	payment_type: z.custom<PaymentType>(),
	bathrooms: z.number().nullable(),
	toilets: z.number().nullable(),
	living_rooms: z.number().nullable(),
	amenities: z.array(z.string()),
	house_rules: z.array(z.string()),
	availability_status: z.custom<AvailabilityStatus>(),
	images_urls: z.array(z.string()),
	video_url: z.string().nullable(),
	google_location_object: z.custom<LocationObject>(),
	google_location_text: z.string(),
	state: z.string(),
	location: z.string(),
	service: z.string(),
	category: z.string(),
	property_type: z.string(),

	// imagesRefPaths: z.array(z.string()).nullable().optional(),
	// videoRefPath: z.string().nullable().optional(),

	reserved_by: z.string().optional(),
	reservation_expiry: z.instanceof(Timestamp).optional(),
})

export type HostSpaceFormData = z.infer<typeof createHostSpaceRequestDTO>

export interface RequestData {
	title?: string
	description?: string
	uuid: string // for tracking firebase storage location

	budget: number
	service_charge: number

	google_location_object: Record<string, any>
	google_location_text: string

	_location_keyword_ref: DocumentReference
	_state_ref: DocumentReference
	_service_ref: DocumentReference
	_category_ref: DocumentReference
	_property_type_ref: DocumentReference
	_user_ref: DocumentReference

	payment_type: PaymentType

	bedrooms: null | number
	bathrooms: null | number
	toilets: null | number
	living_rooms: null | number

	seeking: boolean // if the user is a seeker or a host
	room_type: 'ensuite' | 'shared'
	agency_free_included: boolean

	images_urls: string[]
	video_url: string | null

	availability_status: AvailabilityStatus | null // this should be for only hosts

	createdAt: Timestamp
	updatedAt: Timestamp
}
export const createHostRequestDTO = z.object({
	uuid: z.string(),
	description: z.string(),
	budget: z.number(),
	service_charge: z.number().nullable(),
	payment_type: z.enum([
		'monthly',
		'annually',
		'quarterly',
		'biannually',
		'weekly',
	]),
	availability_status: z.enum(['available', 'unavailable', 'reserved']),
	bathrooms: z.number().nullable(),
	toilets: z.number().nullable(),
	living_rooms: z.number().nullable(),
	amenities: z.array(
		z.custom<DocumentReference | undefined>(
			(val) => val instanceof DocumentReference,
			{
				message: 'Must be a DocumentReference',
			},
		),
	),

	images_urls: z.array(z.string()).min(4),
	video_url: z.string().nullable(),

	house_rules: z.array(z.string()).nullable(),

	seeking: z.boolean(),

	google_location_object: z.custom<LocationObject>(),
	google_location_text: z.string(),

	_location_keyword_ref: z.custom<DocumentReference | undefined>(
		(val) => val instanceof DocumentReference,
		{
			message: 'Must be a DocumentReference',
		},
	),
	_state_ref: z.custom<DocumentReference | undefined>(
		(val) => val instanceof DocumentReference,
		{
			message: 'Must be a DocumentReference',
		},
	),
	_service_ref: z.custom<DocumentReference | undefined>(
		(val) => val instanceof DocumentReference,
		{
			message: 'Must be a DocumentReference',
		},
	),
	_category_ref: z.custom<DocumentReference | undefined>(
		(val) => val instanceof DocumentReference,
		{
			message: 'Must be a DocumentReference',
		},
	),
	_property_type_ref: z.custom<DocumentReference | undefined>(
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
	_user_info_ref: z.custom<DocumentReference | undefined>(
		(val) => val instanceof DocumentReference,
		{
			message: 'Must be a DocumentReference',
		},
	),

	imagesRefPaths: z.array(z.string()),
	videoRefPath: z.string().nullable(),

	reserved_by: z.string().optional(),
	reservation_expiry: z.instanceof(Timestamp).optional(),

	updatedAt: z.union([z.instanceof(Timestamp), timestampSchema]),
	createdAt: z.union([z.instanceof(Timestamp), timestampSchema]),
	background_checks: z
		.record(
			z.string(),
			z.object({
				is_approved: z.enum(['yes', 'no', 'pending']),
			}),
		)
		.optional(),
})
export const createSeekerRequestDTO = z.object({
	description: z.string().optional(),
	rent: z.number(),
	google_location_object: z.custom<LocationObject>(),
	google_location_text: z.string(),
	location: z.string().optional(),
	state: z.string().optional(),
	service: z.string().optional(),

	payment_type: z.enum([
		'monthly',
		'annually',
		'quarterly',
		'biannually',
		'daily',
	]),
})
export type HostRequestData = z.infer<typeof createHostRequestDTO>
export type SeekerRequestData = z.infer<typeof createSeekerRequestDTO>
export type HostRequestDataDetails = Omit<
	HostRequestData,
	| '_location_keyword_ref'
	| '_state_ref'
	| '_service_ref'
	| '_category_ref'
	| '_property_type_ref'
	| '_user_ref'
	| 'amenities'
	| '_user_info_ref'
> & {
	id: string
	_location_keyword_ref: {
		slug: string
		name: string
		id: string
		image_url: string
	}
	_service_ref: { title: string; about: string; slug: string }
	_category_ref: { title: string; slug: string }
	_property_type_ref: { title: string; slug: string }
	_state_ref: { title: string; slug: string }
	_user_ref: {
		first_name: string
		last_name: string
		avatar_url: string
		_id: string
		email: string
	}
	amenities: { title: string; id: string }[]
	_user_info_ref: {
		primary_phone_number: string
		hide_profile: boolean
		is_verified: boolean
		hide_phone: boolean
		gender: string
	}
	ref: DocumentReference
}
export type SeekerRequestDataDetails = Omit<
	SeekerRequestData,
	'location' | 'state' | 'service' | 'user'
> & {
	id: string
	location: OptionType
	service: OptionType
	state: OptionType
	user: AuthUser
	flat_share_profile: FlatShareProfileData
	user_info: UserInfoDTO
	updatedAt: string
}

// export interface FlatShareRequest extends Document {
// 	bedrooms: number
// 	bathrooms: number
// 	toilets: number
// 	rent: number
// 	description: string
// 	house_rules: string[]
// 	living_rooms: number
// 	availability_status: AvailabilityStatus
// 	seeking: boolean
// 	service_charge: number
// 	image_urls: string[]
// 	video_url: string
// 	user: User
// 	user_info: UserInfo
// 	flat_share_profile: FlatShareProfile
// 	location: OptionType & { state: string }
// 	service: OptionType
// 	category: OptionType
// 	amenities: OptionType[]
// 	property_type: OptionType
// 	state: OptionType
// 	view_count: number
// 	call_count: number
// 	question_count: number
// 	google_location_object: any
// 	google_location_text: string
// }
