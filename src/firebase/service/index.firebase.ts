import {
	DocumentData,
	DocumentReference,
	addDoc,
	collection,
	doc,
	serverTimestamp,
	setDoc,
} from 'firebase/firestore'
import { db } from '..'

interface createDTO {
	collection_name: string
	data: object
	document_id: string
}

export default class SherutaDB {
	static defaults = {
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp(),
	}

	static async create(data: createDTO): Promise<any> {
		console.log('SENDING TO DB::', data)
		setDoc(doc(db, data.collection_name, data.document_id), {
			...data.data,
			...this.defaults,
		})
	}

	static async update(data: createDTO) {
		const docRef = await addDoc(collection(db, data.collection_name), {
			...data,
			...this.defaults,
		})
	}
}

export const DBCollectionName = {
	users: 'users',
	userInfos: 'user_infos',
	userSecrets: 'user_secrets',
	userSettings: 'user_settings',

	flatShareProfile: 'flat_share_profiles',
	flatShareRequests: 'flat_share_requests',
}
