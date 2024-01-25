import {
	DocumentData,
	DocumentReference,
	collection,
	doc,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	where,
} from 'firebase/firestore'
import SherutaDB, { DBCollectionName } from '../index.firebase'
import { ConversationData, ConversationsDTO } from './conversations.types'
import { db } from '@/firebase'
import { generateConversationID } from './conversation.utils'

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
			// let isOwner = await this.get(
			// 	generateConversationID({
			// 		owner_id: owner_ref.id,
			// 		guest_id: guest_ref.id,
			// 	}),
			// )
			// let isGuest = await this.get(
			// 	generateConversationID({
			// 		guest_id: owner_ref.id,
			// 		owner_id: guest_ref.id,
			// 	}),
			// )

			if (guest_ref?.id && owner_ref?.id) {
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

	static async get(conversation_id: string): Promise<ConversationData | null> {
		try {
			let _conversation = await getDoc(
				doc(db, DBCollectionName.conversations, conversation_id as string),
			)

			if (!_conversation.exists()) {
				return null
			}

			const conversationData: DocumentData | undefined = { ..._conversation.data(), _id: _conversation.id}

			const participantRefs: DocumentReference[] =
				conversationData?.participants_refs

			const participantPromises = participantRefs.map((participantRef) =>
				getDoc(participantRef),
			)

			const participantDocs = await Promise.all(participantPromises)
			const participants = participantDocs.map((doc) => doc.data())

			conversationData ? (conversationData.participants = participants) : null
			return conversationData as ConversationData | null
		} catch (error) {
			return Promise.reject(error)
		}
	}

	static async forUser(user_id: string) {
		try {
			const conversationsCollection = collection(
				db,
				DBCollectionName.conversations,
			)
			const q = query(
				conversationsCollection,
				where('participants_ids', 'array-contains', user_id),
				limit(10),
				orderBy('updatedAt', 'desc'),
			)

			const conversationsSnapshot = await getDocs(q)

			const allConversations = conversationsSnapshot.docs.map(async (doc) => {
				const conversationData: any = { ...doc.data(), _id: doc.id }
				const participantRefs = conversationData?.participants_refs

				const participantsPromises = participantRefs.map(
					(participantRef: any) => getDoc(participantRef),
				)

				const participantDocs = await Promise.all(participantsPromises)
				const participants = participantDocs.map((participantDoc) =>
					participantDoc.data(),
				)

				return {
					...conversationData,
					participants,
				}
			})

			const result = await Promise.all(allConversations)

			return result
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
