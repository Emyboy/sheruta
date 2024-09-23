import { db } from '@/firebase'
import { resolveDocumentReferences } from '@/utils/index.utils'
import {
	collection,
	doc,
	getDocs,
	orderBy,
	query,
	where,
} from 'firebase/firestore'
import SherutaDB, { DBCollectionName } from '../index.firebase'
import { BookmarkData, BookmarkDataDetails } from './bookmarks.types'

export default class BookmarkService extends SherutaDB {
	static async createBookmark({
		request_id,
		object_type,
		_user_ref,
		uuid,
	}: BookmarkData): Promise<void> {
		const _object_ref = doc(db, DBCollectionName.flatShareRequests, request_id)

		await this.create({
			collection_name: DBCollectionName.bookmarks,
			document_id: uuid,
			data: {
				object_type,
				_user_ref,
				_object_ref,
			},
		})
	}

	static async getSingleBookmark(
		document_id: string,
	): Promise<BookmarkDataDetails | null> {
		const result = (await this.get({
			document_id,
			collection_name: DBCollectionName.bookmarks,
		})) as unknown as BookmarkDataDetails

		return result
	}

	static async deleteBookmark(data: {
		user_id: string
		document_id: string
	}): Promise<boolean> {
		const bookmark = await this.getSingleBookmark(data.document_id)

		if (bookmark?._user_ref._id !== data.user_id) {
			return false
		}

		return await this.delete({
			collection_name: DBCollectionName.bookmarks,
			document_id: data.document_id,
		})
	}

	static async getUserBookmarks(
		user_id: string,
	): Promise<BookmarkDataDetails[]> {
		const collectionRef = collection(db, DBCollectionName.bookmarks)

		const userRef = doc(db, `/users/${user_id}`)

		let q = query(
			collectionRef,
			orderBy('createdAt', 'desc'),
			where('_user_ref', '==', userRef),
		)

		const querySnapshot = await getDocs(q)

		const documents = querySnapshot.docs.map(async (doc) => {
			const docData = { ...doc.data() }

			// Resolve top-level and nested DocumentReference objects
			const resolvedData = await resolveDocumentReferences(docData)

			return { id: doc.id, ...resolvedData } as BookmarkDataDetails
		})

		return await Promise.all(documents)
	}
}
