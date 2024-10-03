import { DocumentReference, Timestamp } from 'firebase/firestore'
import { HostRequestData } from '../request/request.types'

export interface DiscussionDTO {
	uuid: string
	_request_ref: DocumentReference | undefined
	_sender_ref: DocumentReference | undefined
	_receiver_ref?: DocumentReference | undefined
	reply_to?: string | undefined
	nest_level: number
	message: string
	timestamp: Timestamp
	type: string
	request_id: string
}

export interface DiscussionData {
	id: string
	uuid: string
	_request_ref: HostRequestData
	_sender_ref: any
	_receiver_ref?: any
	reply_to?: string
	nest_level: number
	message: string
	timestamp: Timestamp
	type: string
	request_id: string
}
