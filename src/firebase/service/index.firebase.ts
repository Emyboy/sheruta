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
	where,
} from 'firebase/firestore'
import {
	deleteObject,
	getDownloadURL,
	getStorage,
	ref,
	uploadString,
} from 'firebase/storage'
import moment from 'moment'
import { db } from '..'

export interface createDTO {
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
		queryObj = {},
	}: {
		collection_name: string
		_limit: number
		queryObj?: {
			budget?: string
			service?: string
			location?: string
			state?: string
			payment_type?: string
		}
	}): Promise<any> {
		const collectionRef = collection(db, collection_name)

		let q = query(collectionRef, orderBy('updatedAt', 'desc'), limit(_limit))
		if (queryObj.budget) {
			const budgetRanges = queryObj.budget
				.split(',')
				.map((range) => range.split('-').map(Number))
				.sort((a, b) => a[0] - b[0])

			q = query(
				q,
				where('budget', '>=', budgetRanges[0][0]),
				where('budget', '<=', budgetRanges[budgetRanges.length - 1][1]),
			)
		}

		if (queryObj.payment_type) {
			const paymentTypes = queryObj.payment_type.split(',')

			q = query(q, where('payment_type', 'in', paymentTypes))
		}

		if (queryObj.service) {
			const serviceRefs = queryObj.service
				.split(',')
				.map((service) => doc(db, `/services/${service}`))

			q = query(q, where('_service_ref', 'in', serviceRefs))
		}

		if (queryObj.location) {
			const locationRefs = queryObj.location
				.split(',')
				.map((location) => doc(db, `/location_keywords/${location}`))

			q = query(q, where('_location_keyword_ref', 'in', locationRefs))
		}

		if (queryObj.state) {
			const stateRefs = queryObj.state
				.split(',')
				.map((state) => doc(db, `/states/${state}`))

			q = query(q, where('_state_ref', 'in', stateRefs))
		}

		const querySnapshot = await getDocs(q)

		const documents = await Promise.all(
			querySnapshot.docs.map(async (doc) => {
				const docData = { ...doc.data() }

				const refFields = Object.entries(docData).filter(
					([_, value]) => value instanceof DocumentReference,
				)

				const resolvedRefs = await Promise.all(
					refFields.map(async ([key, ref]) => {
						const resolvedDoc = await getDoc(ref as DocumentReference)
						return { [key]: { ...resolvedDoc.data(), id: resolvedDoc.id } }
					}),
				)

				Object.assign(docData, ...resolvedRefs)

				return { id: doc.id, ...docData, ref: doc.ref }
			}),
		)

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

	bookmarks: 'bookmarks',
	flatShareProfile: 'flat_share_profiles',
	flatShareRequests: 'requests',

	messages: 'messages',
	conversations: 'conversations',
	inspections: 'inspections',
	notifications: 'notifications',

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
