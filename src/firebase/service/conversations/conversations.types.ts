import { DocumentReference, Timestamp } from 'firebase/firestore'
import { AuthUser } from '../auth/auth.types'

export interface ConversationsDTO {
	owner_ref: DocumentReference
	owner_id: string
	participants_refs: DocumentReference[]
	participants_ids: string[]
}
// export interface ConversationsDTO {
// 	owner_ref: DocumentReference
// 	owner_id: string
// 	guest_ref: DocumentReference
// 	guest_id: string
// }

export interface ConversationData {
	_id: string
	// owner_id: string
	host: AuthUser
	members: AuthUser[]
	updatedAt: Timestamp
	createdAt: Timestamp
	// participants_ids: string[]
	// owner_ref: DocumentReference
	// participants_refs: DocumentReference[]
}
