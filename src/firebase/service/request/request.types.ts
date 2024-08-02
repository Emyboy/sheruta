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

	payment_type: PaymentPlan

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

export type PaymentPlan =
	| 'monthly'
	| 'annually'
	| 'quarterly'
	| 'bi_annually'
	| 'weekly'

type AvailabilityStatus = 'available' | 'unavailable' | 'reserved'

export const createHostRequestDTO = z.object({
	uuid: z.string(),

	title: z.string().optional(),
	description: z.string().optional(),
	budget: z.number(),
	service_charge: z.number().nullable(),
	payment_type: z.enum(['monthly', 'annually', 'bi-annually', 'weekly']),
	availability_status: z
		.enum(['available', 'unavailable', 'reserved'])
		.nullable(),
	bathrooms: z.number().nullable(),
	toilets: z.number().nullable(),
	living_rooms: z.number().nullable(),

	images_urls: z.array(z.string()),
	video_url: z.string().nullable(),

	seeking: z.boolean(),

	google_location_object: z.record(z.string(), z.any()),
	google_location_text: z.string(),

	_location_keyword_ref: z.custom<DocumentReference>(
		(val) => val instanceof DocumentReference,
		{
			message: 'Must be a DocumentReference',
		},
	),
	_state_ref: z.custom<DocumentReference>(
		(val) => val instanceof DocumentReference,
		{
			message: 'Must be a DocumentReference',
		},
	),
	_service_ref: z.custom<DocumentReference>(
		(val) => val instanceof DocumentReference,
		{
			message: 'Must be a DocumentReference',
		},
	),
	_category_ref: z.custom<DocumentReference>(
		(val) => val instanceof DocumentReference,
		{
			message: 'Must be a DocumentReference',
		},
	),
	_property_type_ref: z.custom<DocumentReference>(
		(val) => val instanceof DocumentReference,
		{
			message: 'Must be a DocumentReference',
		},
	),
	_user_ref: z.custom<DocumentReference>(
		(val) => val instanceof DocumentReference,
		{
			message: 'Must be a DocumentReference',
		},
	),

	createdAt: z.instanceof(Timestamp),
	updatedAt: z.instanceof(Timestamp),
})

export const createSeekerRequestDTO = z.object({
	description: z.string().optional(),
	uuid: z.string(),

	budget: z.number(),

	google_location_object: z.record(z.string(), z.any()),
	google_location_text: z.string(),
	_location_keyword_ref: z.custom<DocumentReference>(
		(val) => val instanceof DocumentReference,
		{
			message: 'Must be a DocumentReference',
		},
	),
	_user_ref: z.custom<DocumentReference>(
		(val) => val instanceof DocumentReference,
		{
			message: 'Must be a DocumentReference',
		},
	),
	_state_ref: z.custom<DocumentReference>(
		(val) => val instanceof DocumentReference,
		{
			message: 'Must be a DocumentReference',
		},
	),
	_service_ref: z.custom<DocumentReference>(
		(val) => val instanceof DocumentReference,
		{
			message: 'Must be a DocumentReference',
		},
	),

	payment_type: z.enum([
		'monthly',
		'annually',
		'bi_annually',
		'quarterly',
		'weekly',
	]),

	seeking: z.boolean(), // true for seekers

	createdAt: z.instanceof(Timestamp),
	updatedAt: z.instanceof(Timestamp),
})
