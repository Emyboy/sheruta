import { DocumentReference } from 'firebase/firestore'

export interface UserSecretsDTO {
	_user_id: string
	_user_ref: DocumentReference
	id_number: string | null
	transaction_code: string | null
}
