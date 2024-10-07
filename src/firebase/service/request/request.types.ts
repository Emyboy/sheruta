import { DocumentReference, Timestamp } from 'firebase/firestore'
import { z } from 'zod'

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
	biannually = 'bi-annually',
	weekly = 'weekly',
}

export type AvailabilityStatus = 'available' | 'unavailable' | 'reserved'

const timestampSchema = z.object({
	seconds: z.number().int().positive(),
	nanoseconds: z.number().int().nonnegative().max(999_999_999),
})

export const createHostRequestDTO = z.object({
	uuid: z.string(),
	description: z.string(),
	budget: z.number(),
	service_charge: z.number().nullable(),
	payment_type: z.enum([
		'monthly',
		'annually',
		'quarterly',
		'bi-annually',
		'weekly',
	]),
	availability_status: z
		.enum(['available', 'unavailable', 'reserved'])
		.nullable(),
	bathrooms: z.number().nullable(),
	toilets: z.number().nullable(),
	living_rooms: z.number().nullable(),
	amenities: z.array(z.string()),

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
				is_approved: z.union([z.literal('pending'), z.boolean()]),
			}),
		)
		.optional(),
})

export const createSeekerRequestDTO = z.object({
	description: z.string().optional(),
	uuid: z.string(),

	budget: z.number(),

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
	_user_ref: z.custom<DocumentReference | undefined>(
		(val) => val instanceof DocumentReference,
		{
			message: 'Must be a DocumentReference',
		},
	),
	payment_type: z.enum([
		'monthly',
		'annually',
		'bi-annually',
		'quarterly',
		'weekly',
	]),

	seeking: z.boolean(), // true for seekers

	updatedAt: z.union([z.instanceof(Timestamp), timestampSchema]),
	createdAt: z.union([z.instanceof(Timestamp), timestampSchema]),
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
	user_info: {
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
	'_location_keyword_ref' | '_state_ref' | '_service_ref' | '_user_ref'
> & {
	id: string
	_location_keyword_ref: { slug: string; id: string }
	_service_ref: { title: string; about: string; slug: string }
	_category_ref: { title: string; slug: string }
	_property_type_ref: { title: string }
	_state_ref: { title: string; slug: string }
	_user_ref: {
		first_name: string
		last_name: string
		avatar_url: string
		_id: string
		email: string
	}
	flat_share_profile: { bio: string | null }
	user_info: {
		primary_phone_number: string
		hide_profile: boolean
		is_verified: boolean
		gender: string
	}
	ref: DocumentReference
}
