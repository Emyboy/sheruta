import { db } from '@/firebase'
import { resolveDocumentReferences } from '@/utils/index.utils'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import SherutaDB, { DBCollectionName } from '../index.firebase'
import { DiscussionDTO } from './discussions.types'

export default class DiscussionService extends SherutaDB {
	static async fetchMessages({ request_id }: { request_id: string }) {
		try {
			const collectionRef = collection(db, DBCollectionName.discussions)
			let q = query(
				collectionRef,
				orderBy('updatedAt', 'desc'),
				where('request_id', '==', request_id),
			)

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

	static async sendMessage(data: DiscussionDTO) {
		await this.create({
			collection_name: DBCollectionName.discussions,
			data,
			document_id: data.uuid,
		})
	}
}
