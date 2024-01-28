import { DocumentReference, Timestamp } from 'firebase/firestore'

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
	_conversation_id: string
	_conversation_ref: DocumentReference
	_sender_ref: DocumentReference
	_sender_id: string
	_receiver_id: string
	_receiver_ref: DocumentReference
	message_text: string
	seen: boolean
	createdAt: Timestamp
	updatedAt: Timestamp
}
