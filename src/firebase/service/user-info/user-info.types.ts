import { NINResponseDTO } from '@/components/types'
import { DocumentReference } from 'firebase/firestore'

export interface UserInfo {
	id: string
	user_id: string
	_user_id: string
	gender?: 'male' | 'female' | null
	primary_phone_number: string | null
	whatsapp_phone_number: string | null
	is_verified: boolean
	phone_number_verified: boolean
	date_of_birth: string | null
	nin: string | null
	hide_profile: boolean
	hide_phone: boolean
	done_kyc: boolean
	nin_data?: NINResponseDTO
	done_kyc: true
}

export interface UserInfoDTO {
	_user_id: string
	_user_ref: DocumentReference
	gender: 'male' | 'female' | null
	primary_phone_number: null | string
	whatsapp_phone_number: null
	done_kyc: boolean
	phone_number_verified: boolean
	date_of_birth: string | null
	nin: string | null
	hide_profile: boolean
	hide_phone: boolean
	is_verified: boolean
	nin_data?: NINResponseDTO
}
