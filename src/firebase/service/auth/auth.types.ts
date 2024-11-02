import { Timestamp } from 'firebase/firestore'
import { z } from 'zod'

export const RegisterDTOSchema = z.object({
	uid: z.string(),
	providerId: z.string(),
	photoURL: z.string().nullable(),
	phoneNumber: z.string().nullable(),
	email: z.string(),
	displayName: z.string(),
})

export type RegisterDTO = z.infer<typeof RegisterDTOSchema>

export type AuthUserDTO = {
	_id: string
	first_name: string
	last_name: string
	email: string
	email_verified: boolean
	providerId: 'google' | 'facebook'
	avatar_url: string | null
	account_status: 'active' | 'suspended'
	last_seen: Timestamp
}

export interface AuthUser {
	_id: string
	first_name: string
	last_name: string
	email: string
	email_verified: boolean
	providerId: string
	avatar_url: string
	last_seen: Timestamp
}

export interface WalletType {
	_id: string
	total_credit: number
	total_deposit: number
	user: string
}
