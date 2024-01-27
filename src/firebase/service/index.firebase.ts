import {
	addDoc,
	collection,
	doc,
	getDoc,
	serverTimestamp,
	setDoc,
	updateDoc,
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
		let result = await getDoc(
			doc(db, data.collection_name, data.document_id as string),
		)
		return result
	}

	static async update(data: createDTO) {
		const ref = doc(db, data.collection_name, data.document_id);
		await updateDoc(ref, {
			...data.data,
			updatedAt: serverTimestamp()
		});

		// fetching the updated value;
		const docRef = doc(db, data.collection_name, data.document_id);
		const docSnap = await getDoc(docRef);
		return docSnap;
	}
}

export const DBCollectionName = {
	users: 'users',
	userInfos: 'user_infos',
	userSecrets: 'user_secrets',
	userSettings: 'user_settings',

	flatShareProfile: 'flat_share_profiles',
	flatShareRequests: 'flat_share_requests',

	messages: 'messages',
	conversations: 'conversations',
}
