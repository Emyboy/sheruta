import { DocumentReference } from 'firebase/firestore'

export interface UserInfo {
	id: string
	user_id: string
	primary_phone_number: string
	credits: number
}

export interface UserInfoDTO {
	_user_id: string
	_user_ref: DocumentReference
	gender: 'male' | 'female' | null
	primary_phone_number: null | string
	whatsapp_phone_number: null
	credits: number
}
