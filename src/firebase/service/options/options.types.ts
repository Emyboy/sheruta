import { DocumentReference } from 'firebase/firestore'

export interface Option {
	id: string
	name: string
	slug: string
	_ref: DocumentReference
}

export interface HabitData {
	id: string
	title: string
	slug: string
	_ref: DocumentReference
}
export interface InterestData {
	id: string
	title: string
	slug: string
	_ref: DocumentReference
}
