import { DocumentReference } from 'firebase/firestore'
import { z } from 'zod'
import { PaymentType } from '../request/request.types'

// Define the Zod schema for FlatShareProfileData
const FlatShareProfileDataSchema = z.object({
	_user_info_ref: z.any(),
	_user_id: z.string(),
	_user_ref: z.any(),
	seeking: z.boolean().nullable(),
	done_kyc: z.boolean(),
	budget: z.number().nullable(),
	credits: z.number(),
	occupation: z.string().nullable().optional(),
	location_keyword: z.any().nullable().optional(),
	state: z.any().nullable().optional(),
	employment_status: z.string().nullable(),
	work_industry: z.string().nullable(),
	tiktok: z.string().nullable(),
	facebook: z.string().nullable(),
	instagram: z.string().nullable(),
	twitter: z.string().nullable(),
	linkedin: z.string().nullable(),
	habits: z.array(z.any()),
	interests: z.array(z.any()),
	religion: z.string().nullable(),
	verified: z.boolean(),
	gender_preference: z.string().nullable().optional(),
	age_preference: z.string().nullable().optional(),
	payment_type: z
		.enum(['monthly', 'annually', 'bi-annually', 'quarterly', 'weekly'])
		.nullable(),
	bio: z.string().nullable(),
	// bio: z.string().optional(),
	// socials: z.object({
	// 	twitter: z.string().optional(),
	// 	facebook: z.string().optional(),
	// 	instagram: z.string().optional(),
	// 	tiktok: z.string().optional(),
	// 	linkedin: z.string().optional(),
	//   }).nullable()
})

export type FlatShareProfileData = z.infer<typeof FlatShareProfileDataSchema>
export const FlatShareProfileDataDTO = FlatShareProfileDataSchema
export type UpdateFlatShareProfileDataDTO = {
	occupation?: string
	employment_status?: string
	work_industry?: string
	religion?: string
	tiktok?: string
	facebook?: string
	instagram?: string
	twitter?: string
	linkedin?: string
	location_keyword?: DocumentReference | null
	state?: DocumentReference | null
	budget?: number
	seeking?: boolean
	credits?: number
	habits?: any[]
	interests?: any[]
	done_kyc: boolean
	bio?: string
	gender_preference?: string
	age_preference?: string
	payment_type?: PaymentType | null
	// socials: object
}

export const flatShareProfileDefaults = {
	religion: null,
	verified: false,
	employment_status: null,
	facebook: null,
	instagram: null,
	linkedin: null,
	tiktok: null,
	twitter: null,
	work_industry: null,
	location_keyword: null,
	occupation: null,
	state: null,
	budget: null,
	seeking: null,
	credits: 0,
	habits: [],
	interests: [],
	done_kyc: false,
	gender_preference: null,
	age_preference: null,
	bio: null,
	payment_type: null,
}
