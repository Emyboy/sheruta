import { DocumentReference } from 'firebase/firestore'
import SherutaDB, { DBCollectionName } from '../index.firebase'
import { ConversationsDTO } from './conversations.types'

export default class ConversationsService {
	static async create({
		owner_ref,
		guest_ref,
		conversation_id,
	}: {
		owner_ref: DocumentReference
		guest_ref: DocumentReference
		conversation_id: string
	}) {
		try {
			if (guest_ref?.id && owner_ref?.id) {
				// let data: ConversationsDTO = {
				// 	owner_ref,
				// 	owner_id: owner_ref.id,
				// 	guest_ref,
				// 	guest_id: guest_ref.id,
				// }
				let data: ConversationsDTO = {
					owner_ref,
					owner_id: owner_ref.id,
					participants_ids: [guest_ref.id, owner_ref.id],
					participants_refs: [guest_ref, owner_ref],
				}

				let result = await SherutaDB.create({
					collection_name: DBCollectionName.conversations,
					data,
					document_id: conversation_id,
				})

				return result
			}
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
