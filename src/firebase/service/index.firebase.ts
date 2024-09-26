import { resolveDocumentReferences } from '@/utils/index.utils'
import {
	collection,
	deleteDoc,
	doc,
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
	uploadString,
} from 'firebase/storage'
import moment from 'moment'
import { db } from '..'

export interface CreateDTO {
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

	static async create(data: CreateDTO): Promise<any> {
		try {
			console.log('SENDING TO DB::', data)
			await setDoc(doc(db, data.collection_name, data.document_id), {
				...this.defaults,
				...data.data,
			})
			const result = await getDoc(
				doc(db, data.collection_name, data.document_id),
			)
			return result.data()
		} catch (error) {
			console.error('Error creating document:', error)
			throw new Error('Failed to create document')
		}
	}

	static async update(data: CreateDTO): Promise<any> {
		try {
			console.log('UPDATING DB::', data)
			const ref = doc(db, data.collection_name, data.document_id)
			await updateDoc(ref, {
				...data.data,
				updatedAt: serverTimestamp(),
			})
			const docSnap = await getDoc(ref)
			return docSnap.data()
		} catch (error) {
			console.error('Error updating document:', error)
			throw new Error('Failed to update document')
		}
	}

	static async getAll({
		collection_name,
		_limit = 20,
	}: {
		collection_name: string
		_limit?: number
	}): Promise<any> {
		try {
			const collectionRef = collection(db, collection_name)
			let q = query(collectionRef, orderBy('updatedAt', 'desc'), limit(_limit))

			const querySnapshot = await getDocs(q)
			const documents = await Promise.all(
				querySnapshot.docs.map(async (doc) => {
					const docData = { ...doc.data() }
					const resolvedData = await resolveDocumentReferences(docData)
					return { id: doc.id, ...resolvedData, ref: doc.ref }
				}),
			)

			return documents
		} catch (error) {
			console.error('Error fetching documents:', error)
			throw new Error('Failed to fetch documents')
		}
	}

	static async get({
		document_id,
		collection_name,
	}: {
		document_id: string
		collection_name: string
	}): Promise<any> {
		try {
			const docRef = doc(db, collection_name, document_id)
			const docSnap = await getDoc(docRef)

			if (docSnap.exists()) {
				const docData = { ...docSnap.data() }
				const resolvedData = await resolveDocumentReferences(docData)
				return { id: docSnap.id, ...resolvedData, ref: docSnap.ref }
			} else {
				return null
			}
		} catch (error) {
			console.error('Error fetching document:', error)
			throw new Error('Failed to fetch document')
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
			return true
		} catch (error) {
			console.error('Error deleting document:', error)
			throw new Error('Failed to delete document')
		}
	}

	static async uploadMedia({
		data,
		storageUrl,
	}: {
		data: string
		storageUrl: string
	}): Promise<any> {
		try {
			const storage = getStorage()
			const storageRef = ref(storage, storageUrl)
			const snapshot = await uploadString(storageRef, data, 'data_url')
			return snapshot
		} catch (error) {
			console.error('Error uploading media:', error)
			throw new Error('Failed to upload media')
		}
	}

	static async getMediaUrl(url: string): Promise<string | null> {
		try {
			const storage = getStorage()
			const storageRef = ref(storage, url)
			return await getDownloadURL(storageRef)
		} catch (error) {
			console.error('Error fetching media URL:', error)
			return null
		}
	}

	static async deleteMedia(url: string): Promise<boolean> {
		try {
			const storage = getStorage()
			const storageRef = ref(storage, url)
			await deleteObject(storageRef)
			return true
		} catch (error) {
			console.error('Error deleting media:', error)
			throw new Error('Failed to delete media')
		}
	}
}

export const DBCollectionName = {
	users: 'users',
	userInfos: 'user_infos',
	userSecrets: 'user_secrets',
	userSettings: 'user_settings',
	userProfile: 'user_profile',
	userProfileSnippet: 'user_profile_snippet',

	flatShareProfile: 'flat_share_profiles',
	flatShareRequests: 'requests',

	discussions: 'discussions',
	messages: 'messages',
	conversations: 'conversations',
	inspections: 'inspections',
	notifications: 'notifications',
	bookmarks: 'bookmarks',
	reservations: 'reservations',

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
