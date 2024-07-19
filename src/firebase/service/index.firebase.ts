import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	limit,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
} from 'firebase/firestore'
import { db } from '..'
import moment from 'moment'
import { getStorage, ref, uploadString } from 'firebase/storage'

interface createDTO {
	collection_name: string
	data: object
	document_id: string
}

export default class SherutaDB {
	static defaults = {
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp(),
		deleteDate: moment().add(2, 'months').toDate(),
	}

	static async create(data: createDTO): Promise<any> {
		console.log('SENDING TO DB::', data)
		await setDoc(doc(db, data.collection_name, data.document_id), {
			...this.defaults,
			...data.data,
		})
		let result = await getDoc(
			doc(db, data.collection_name, data.document_id as string),
		)
		return result.data()
	}

	static async update(data: createDTO) {
		console.log('UPDATING DB::', data)
		const ref = doc(db, data.collection_name, data.document_id)
		await updateDoc(ref, {
			...data.data,
			updatedAt: serverTimestamp(),
		})

		// fetching the updated value;
		const docRef = doc(db, data.collection_name, data.document_id)
		const docSnap = await getDoc(docRef)
		return docSnap.data()
	}

	static async getAll({
		collection_name,
		_limit = 20,
	}: {
		collection_name: string
		_limit: number
	}): Promise<any> {
		const collectionRef = collection(db, collection_name)
		//@ts-ignore
		const querySnapshot = await getDocs(collectionRef, limit(_limit))
		const documents = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
			ref: doc.ref,
		}))
		return documents
	}

	static async get({
		document_id,
		collection_name,
	}: {
		document_id: string
		collection_name: string
	}) {
		const docRef = doc(db, collection_name, document_id)
		const docSnap = await getDoc(docRef)

		if (docSnap.exists()) {
			return docSnap.data()
		} else {
			return null
		}
	}

	static async delete({
		collection_name,
		document_id,
	}: {
		collection_name: string
		document_id: string
	}): Promise<boolean> {
		try {
			const docRef = doc(db, collection_name, document_id)
			await deleteDoc(docRef)
			return Promise.resolve(true)
		} catch (error) {
			return Promise.reject(error)
		}
	}

	static async uploadMedia({
		data,
		storageUrl,
	}: {
		data: string
		storageUrl: string
	}) {
		const storage = getStorage()
		const storageRef = ref(storage, storageUrl)

		const snapshot = await uploadString(storageRef, data, 'data_url')
		return snapshot
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

	// options
	locationKeyWords: 'location_keywords',
	states: 'states',
	services: 'services',
	habits: 'habits',
	interests: 'interests',
	categories: 'categories',
}
