import { db } from '@/firebase'
import {
	collection,
	doc,
	getDocs,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
	where,
} from 'firebase/firestore'
import moment from 'moment'
import { DBCollectionName } from '../index.firebase'
import { NotificationsType } from './notifications.types'

export const NotificationsBodyMessage: Record<
	NotificationsType['type'],
	string
> = {
	reservation: 'reserved your apartment listing',
	rescheduled: 'rescheduled your inspection',
	call: 'tried to call you',
	inspection: 'scheduled an inspection with you',
	message: 'sent you a message',
	comment: 'commented on your apartment listing',
	comment_reply: 'replied your comment',
	profile_view: 'viewed your profile',
	cancelled: 'cancelled your inspection',
	bookmark: 'saved your apartment listing',
}

export default class NotificationsService {
	static defaults = {
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp(),
		deleteDate: moment().add(2, 'months').toDate(),
	}

	static async create({
		collection_name,
		data,
	}: {
		collection_name: string
		data: NotificationsType
	}): Promise<any> {
		await setDoc(doc(collection(db, collection_name)), {
			...this.defaults,
			...data,
		})
	}

	static async fetchNotifications(id: string) {
		const collectionRef = collection(db, DBCollectionName.notifications)

		const q = query(collectionRef, where('recipient_id', '==', id))

		const docsSnapshot = await getDocs(q)

		return docsSnapshot.docs.map((doc) => ({
			ref: doc.ref,
			id: doc.id,
			...doc.data(),
		}))
	}

	static async readNotification(id: string) {
		const ref = doc(db, DBCollectionName.notifications, id)
		await updateDoc(ref, {
			is_read: true,
			updatedAt: serverTimestamp(),
		})
	}
}
