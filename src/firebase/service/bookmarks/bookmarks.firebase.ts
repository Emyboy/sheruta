import { db } from '@/firebase'
import {
	collection,
	doc,
	getDoc,
	getDocs,
	or,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
	where,
	DocumentData,
} from 'firebase/firestore'
import moment from 'moment'
import SherutaDB, { createDTO, DBCollectionName } from '../index.firebase'
import { BookmarkDataDetails } from './bookmarks.types'

export default class BookmarkService extends SherutaDB {
	static async getUserBookmarks(
		userId: string,
	): Promise<DocumentData[] | null> {
		const collectionRef = collection(db, DBCollectionName.bookmarks)

		// Fetch all bookmarks
		const docsSnapshot = await getDocs(query(collectionRef))

		const bookmarks = docsSnapshot.docs.map((doc) => ({
			ref: doc.ref,
			id: doc.id,
			...doc.data(),
		}))

		const userBookmarks = await Promise.all(
			bookmarks.map(async (bookmark: any) => {
				const snapShot = await getDoc(bookmark._user_ref)
				if (snapShot && snapShot.exists()) {
					const data = snapShot.data()
					if (data?._id === userId) {
						return bookmark // Return the bookmark if it matches the userId
					}
				}
				return null // Return null if it doesn't match
			}),
		)

		// Filter out null values from userBookmarks
		return userBookmarks.filter((bookmark) => bookmark !== null)
	}
}
