import { DocumentReference, Timestamp } from 'firebase/firestore'
import { AuthUser } from '../auth/auth.types'

export interface DirectMessageDTO {
	_conversation_id: string
	_conversation_ref: DocumentReference
	_sender_ref: DocumentReference
	_sender_id: string
	_receiver_id: string
	_receiver_ref: DocumentReference
	message_text: string
	seen: boolean
}

export interface DirectMessageData {
	_id: string
	sender: AuthUser
	content: string
	seen: boolean
	conversation: string
	request: null | string
	// _conversation_ref: DocumentReference
	// _sender_ref: DocumentReference
	// _sender_id: string
	// _receiver_id: string
	// _receiver_ref: DocumentReference
	createdAt: string
	updatedAt: string
}
