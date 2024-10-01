import { db } from '@/firebase'
import { resolveDocumentReferences } from '@/utils/index.utils'
import {
	collection,
	doc,
	DocumentData,
	getDocs,
	limit,
	query,
	where,
} from 'firebase/firestore'
import SherutaDB, { DBCollectionName } from '../index.firebase'
import { AnalyticsDataDetails } from './analytics.types'

export default class AnalyticsService extends SherutaDB {
	static async addData(data: {
		calls?: number
		messages?: number
		posts?: number
		location_keyword_id: string
		uuid: string
	}): Promise<DocumentData | undefined> {
		//check if analytic data is created already
		const initialCounts = await this.getDataByLocationKeyword(
			data.location_keyword_id,
		)

		if (initialCounts) return undefined

		const locRef = doc(db, `/location_keywords/${data.location_keyword_id}`)

		return await this.create({
			collection_name: DBCollectionName.analytics,
			document_id: data.uuid,
			data: {
				_location_keyword_ref: locRef,
				calls: data?.calls ? data.calls : 0,
				messages: data?.messages ? data.messages : 0,
				posts: data?.posts ? data.posts : 0,
			},
		})
	}

	static async updateData(data: {
		calls?: number
		messages?: number
		posts?: number
		location_keyword_id: string
	}): Promise<DocumentData | undefined> {
		//get data by location_keyword
		const initialCounts = await this.getDataByLocationKeyword(
			data.location_keyword_id,
		)

		if (!initialCounts) return undefined

		const locRef = doc(
			db,
			`/location_keywords/${initialCounts._location_keyword_ref.id}`,
		)

		const newData = {
			calls: data?.calls
				? initialCounts.calls + data.calls
				: initialCounts.calls,
			messages: data?.messages
				? initialCounts.messages + data.messages
				: initialCounts.messages,
			posts: data?.posts
				? initialCounts.posts + data.posts
				: initialCounts.posts,
			_location_keyword_ref: locRef,
		}

		return await this.update({
			collection_name: DBCollectionName.analytics,
			document_id: initialCounts.id,
			data: {
				...newData,
			},
		})
	}

	static async getSingleData(
		document_id: string,
	): Promise<AnalyticsDataDetails | null> {
		const result = (await this.get({
			document_id,
			collection_name: DBCollectionName.analytics,
		})) as unknown as AnalyticsDataDetails

		return result
	}

	static async getAllData(): Promise<AnalyticsDataDetails[]> {
		return await this.getAll({
			collection_name: DBCollectionName.analytics,
		})
	}

	static async getDataByLocationKeyword(
		location_keyword_id: string,
	): Promise<AnalyticsDataDetails | undefined> {
		console.log(location_keyword_id)

		const collectionRef = collection(db, DBCollectionName.analytics)
		const locRef = doc(db, `/location_keywords/${location_keyword_id}`)

		const q = query(
			collectionRef,
			where('_location_keyword_ref', '==', locRef),
			limit(1),
		)

		// Use getDocs to retrieve the documents
		const querySnapshot = await getDocs(q)

		// Check if a document exists
		if (!querySnapshot.empty) {
			const doc = querySnapshot.docs[0]
			const docData = { ...doc.data() }

			// Resolve top-level and nested DocumentReference objects
			const resolvedData = await resolveDocumentReferences(docData)

			return { id: doc.id, ...resolvedData } as AnalyticsDataDetails
		}

		return undefined
	}
}
