import { getAuth } from 'firebase/auth'
import SherutaDB, { DBCollectionName } from '../index.firebase'
import { DocumentData, doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import ConversationsService from '../conversations/conversations.firebase'
import { DirectMessageDTO } from './messages.types'
import { hasEmptyValue } from '@/utils/index.utils'

export default class MessagesService {
	static async sendDM({
		message,
		conversation_id,
		recipient_id,
	}: {
		message: string
		conversation_id: string
		recipient_id: string
	}) {
		try {
			console.log('INCOMING::', { message, conversation_id, recipient_id })
			let auth = await getAuth()
			let uid = await auth.currentUser?.uid
			let _user = await getDoc(doc(db, DBCollectionName.users, uid as string))
			let _conversation = await getDoc(
				doc(db, DBCollectionName.conversations, conversation_id),
			)
			let _guest = await getDoc(doc(db, DBCollectionName.users, recipient_id))

			let theConversation: DocumentData

			if (!_conversation.exists()) {
				console.log('NO CONVERSATION')
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
				_sender_id: uid as string,
				_sender_ref: _user.ref,
				_receiver_id: _guest.id,
				_receiver_ref: _guest.ref,
				_conversation_id: theConversation.id as string,
				_conversation_ref: theConversation.ref,
			}

			if (hasEmptyValue(data)) {
				return Promise.reject('no or invalid data')
			}

			// console.log("OUTCOME::", {
			// 	theConversation,
			// 	_guest: _guest.data(),
			// 	_user: _user.data(),
			// 	data,
			// });

			let result = await SherutaDB.create({
				collection_name: DBCollectionName.messages,
				data,
				document_id: crypto.randomUUID() + Date.now(),
			})

			return Promise.resolve(result)
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
