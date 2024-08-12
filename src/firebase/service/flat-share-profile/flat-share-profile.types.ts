import { DocumentReference } from 'firebase/firestore'
import { z } from 'zod'

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
	location_keyword?: string
	state?: string
	budget?: number
	seeking?: boolean
	credits?: number
	habits?: any[]
	interests?: any[]
	done_kyc: boolean
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
}
