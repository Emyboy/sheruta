import { DocumentReference } from 'firebase/firestore'

export interface UserInfo {
	id: string
	user_id: string
	gender?: 'male' | 'female' | null
	primary_phone_number: string | null
	whatsapp_phone_number: string | null
}

export interface UserInfoDTO {
	_user_id: string
	_user_ref: DocumentReference
	gender: 'male' | 'female' | null
	primary_phone_number: null | string
	whatsapp_phone_number: null
	done_kyc: boolean
}
