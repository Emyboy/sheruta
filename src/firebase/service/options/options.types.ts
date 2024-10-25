import { DocumentReference } from 'firebase/firestore'

export interface Option {
	id: string
	name: string
	slug: string
}

export interface HabitData {
	_id: string
	title: string
	slug: string
}
export interface InterestData {
	_id: string
	title: string
	slug: string
}
