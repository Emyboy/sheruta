import { OptionType } from '@/context/options.context'
import { DocumentReference, Timestamp } from 'firebase/firestore'
import { z } from 'zod'
import { AuthUser } from '../auth/auth.types'
import { FlatShareProfileData } from '../flat-share-profile/flat-share-profile.types'
import { UserInfo, UserInfoDTO } from '../user-info/user-info.types'

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
	// availability_status: z.custom<AvailabilityStatus>(),
	image_urls: z.array(z.string()),
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
	// uuid: z.string(),
	description: z.string(),
	rent: z.number(),
	service_charge: z.number().nullable(),
	payment_type: z.enum([
		'monthly',
		'annually',
		'quarterly',
		'biannually',
		'daily',
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

	image_urls: z.array(z.string()).min(4),
	video_url: z.string().nullable(),

	house_rules: z.array(z.string()).nullable(),

	seeking: z.boolean(),

	google_location_object: z.custom<LocationObject>(),
	google_location_text: z.string(),
	location: z.string(),
	state: z.string(),
	service: z.string(),
	category: z.string(),
	property_type: z.string(),

	imagesRefPaths: z.array(z.string()),
	videoRefPath: z.string().nullable(),

	reserved_by: z.string().optional(),
	reservation_expiry: z.instanceof(Timestamp).optional(),

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
	description: z.string(),
	rent: z.number(),
	google_location_object: z.custom<LocationObject>(),
	google_location_text: z.string(),
	location: z.string(),
	state: z.string(),
	service: z.string(),

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
	| 'location'
	| 'state'
	| 'service'
	| 'user'
	| 'category'
	| 'property_type'
	| 'amenities'
	| 'user_info'
> & {
	_id: string
	location: OptionType
	service: OptionType
	state: OptionType
	property_type: any
	amenities: any
	category: any
	user: AuthUser
	user_info: UserInfoDTO
	flat_share_profile: FlatShareProfileData
	updatedAt: string
	createdAt: string
	seeking: boolean
}

export interface FlatShareRequest {
	_id: string
	bedrooms: number
	bathrooms: number
	toilets: number
	rent: number
	description: string
	house_rules: string[]
	living_rooms: number
	availability_status: AvailabilityStatus
	seeking: boolean
	service_charge: number
	image_urls: string[]
	video_url: string
	user: AuthUser
	user_info: UserInfo
	flat_share_profile: FlatShareProfileData
	location: OptionType & { state: string }
	service: OptionType
	category: OptionType
	amenities: OptionType[]
	property_type: OptionType
	state: OptionType
	view_count: number
	call_count: number
	question_count: number
	google_location_object: any
	google_location_text: string
	updatedAt: Date
	createdAt: Date
	reserved_by: string | undefined
	reservation_expiry: Date | undefined
	background_checks: any | undefined
}

export type SeekerRequestDataDetails = Omit<
	SeekerRequestData,
	'location' | 'state' | 'service' | 'user'
> & {
	_id: string
	location: OptionType
	service: OptionType
	state: OptionType
	user: AuthUser
	flat_share_profile: FlatShareProfileData
	user_info: UserInfoDTO
	updatedAt: string
	createdAt: string
	seeking: boolean
}

// export interface FlatShareRequest{
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
// 	user: AuthUser
// 	user_info: UserInfoDTO
// 	flat_share_profile: FlatShareProfileData
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
