import { getAuth } from 'firebase/auth'
import SherutaDB, { DBCollectionName } from '../index.firebase'
import { DocumentData, doc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase'
import ConversationsService from '../conversations/conversations.firebase'
import { DirectMessageDTO } from './messages.types'
import { hasEmptyValue } from '@/utils/index.utils'

export default class MessagesService {
	static async sendDM(req: {
		message: string
		conversation_id: string
		recipient_id: string
		user_id: string
	}) {
		const { message, conversation_id, recipient_id, user_id } = req
		try {
			if (hasEmptyValue(req)) {
				return Promise.reject('no or invalid data')
			}
			let _user = await getDoc(doc(db, DBCollectionName.users, user_id))
			let _conversation = await getDoc(
				doc(db, DBCollectionName.conversations, conversation_id),
			)
			let _guest = await getDoc(doc(db, DBCollectionName.users, recipient_id))

			let theConversation: DocumentData

			if (!_conversation.exists()) {
				theConversation = await ConversationsService.create({
					guest_ref: _guest.ref,
					owner_ref: _user.ref,
					conversation_id,
				})
			} else {
				theConversation = _conversation
			}

			let data: DirectMessageDTO = {
				message_text: message,
				_sender_id: user_id,
				_sender_ref: _user.ref,
				_receiver_id: _guest.id,
				_receiver_ref: _guest.ref,
				_conversation_id: theConversation.id as string,
				_conversation_ref: theConversation.ref,
				seen: false,
			}

			if (hasEmptyValue(data)) {
				return Promise.reject('no or invalid data')
			}

			let result = await SherutaDB.create({
				collection_name: DBCollectionName.messages,
				data,
				document_id: crypto.randomUUID() + Date.now(),
			})

			SherutaDB.update({
				collection_name: DBCollectionName.conversations,
				data: { updatedAt: serverTimestamp() },
				document_id: conversation_id,
			})

			return Promise.resolve(result)
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
