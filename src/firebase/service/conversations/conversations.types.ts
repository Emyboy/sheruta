import { DocumentReference } from 'firebase/firestore'

export interface ConversationsDTO {
	owner_ref: DocumentReference
	owner_id: string
	guest_ref: DocumentReference
	guest_id: string
}
