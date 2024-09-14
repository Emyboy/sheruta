import { db } from '@/firebase'
import {
	collection,
	getDoc,
	getDocs,
	query,
	DocumentData,
} from 'firebase/firestore'
import SherutaDB, { DBCollectionName } from '../index.firebase'
import { BookmarkData, BookmarkDataDetails } from './bookmarks.types'
import { AuthUser } from '../auth/auth.types'

export default class BookmarkService extends SherutaDB {
	static async createBookmark(data: BookmarkData): Promise<void> {
		await this.create({
			collection_name: DBCollectionName.bookmarks,
			document_id: data.uuid,
			data: {
				title: data.title,
				_user_ref: data._user_ref,
				_object_ref: data._object_ref,
				object_type: data.object_type,
				// object_id: data.object_id,
			},
		})
	}

	// static async getSingleBookmark(documentId: string): Promise<BookmarkDataDetails | null> {

	// 	const docRef = doc(db, DBCollectionName.bookmarks, documentId);
	// 	const docSnap = await getDoc(docRef);

	// 	if (docSnap.exists()) {
	// 		// Return the bookmark data with the document reference and id
	// 		return {
	// 			ref: docRef,
	// 			id: docSnap.id,
	// 			...docSnap.data(),
	// 		} as unknown as BookmarkDataDetails;
	// 	} else {
	// 		return null; // Return null if the document doesn't exist
	// 	}

	// }

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
		//check if bookmark belongs to user
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
		const bookmarks = await this.getAll({
			collection_name: DBCollectionName.bookmarks,
			_limit: 1000,
		})

		// Filter bookmarks based on _user_ref matching the given user_id
		const userBookmarks = await Promise.all(
			bookmarks.map(async (bookmark: BookmarkDataDetails) => {
				// Ensure _user_ref exists before performing operations
				if (bookmark._user_ref && bookmark._user_ref._id === user_id) {
					return bookmark
				}
				return null
			}),
		)

		// Filter out any null values
		return userBookmarks.filter(
			(bookmark) => bookmark !== null,
		) as BookmarkDataDetails[]
	}
}
