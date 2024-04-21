import { DocumentReference } from 'firebase/firestore'

export interface Option {
	id: string
	name: string
	slug: string
}

export interface HabitData {
	id: string;
	title: string
	slug: string
	ref: DocumentReference
}
