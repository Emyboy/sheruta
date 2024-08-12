import {
	collection,
	deleteDoc,
	doc,
	DocumentReference,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
} from 'firebase/firestore'
import {
	deleteObject,
	getDownloadURL,
	getStorage,
	ref,
	StorageReference,
	uploadString,
} from 'firebase/storage'
import moment from 'moment'
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

		const docSnap = await getDoc(ref)
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

		// Chain the query constraints with the `query` function
		const q = query(collectionRef, orderBy('updatedAt', 'desc'), limit(_limit))

		// console.log(q)

		const querySnapshot = await getDocs(q)

		const documents = querySnapshot.docs.map(async (doc) => {
			const docData = { ...doc.data() }

			const refFields = Object.entries(docData).filter(
				([key, value]) => value instanceof DocumentReference,
			)

			const resolvedRefs = await Promise.all(
				refFields.map(async ([key, ref]) => {
					const resolvedDoc = await getDoc(ref)
					return { [key]: resolvedDoc.data() }
				}),
			)

			Object.assign(docData, ...resolvedRefs)

			return { id: doc.id, ...docData, ref: doc.ref }
		})

		return await Promise.all(documents)
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
			const docData = { ...docSnap.data() }

			const refFields = Object.entries(docData).filter(
				([key, value]) => value instanceof DocumentReference,
			)

			const resolvedRefs = await Promise.all(
				refFields.map(async ([key, ref]) => {
					const resolvedDoc = await getDoc(ref)
					return { [key]: resolvedDoc.data() }
				}),
			)

			Object.assign(docData, ...resolvedRefs)

			return { id: docSnap.id, ...docData, ref: docSnap.ref }
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

	static async getMediaUrl(url: string) {
		const storage = getStorage()
		const storageRef = ref(storage, url)

		try {
			const url = await getDownloadURL(storageRef)

			return url
		} catch (error) {
			console.log(error)
			return null
		}
	}

	static async deleteMedia(url: string) {
		const storage = getStorage()
		const storageRef = ref(storage, url)

		try {
			await deleteObject(storageRef)
			return Promise.resolve(true)
		} catch (error) {
			return Promise.reject(error)
		}
	}
}

export const DBCollectionName = {
	users: 'users',
	userInfos: 'user_infos',
	userSecrets: 'user_secrets',
	userSettings: 'user_settings',

	flatShareProfile: 'flat_share_profiles',
	flatShareRequests: 'requests',

	messages: 'messages',
	conversations: 'conversations',

	// options
	propertyTypes: 'property_types',
	locationKeyWords: 'location_keywords',
	states: 'states',
	services: 'services',
	habits: 'habits',
	interests: 'interests',
	categories: 'categories',
	amenities: 'amenities',
}
