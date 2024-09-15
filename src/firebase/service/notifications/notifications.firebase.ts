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
	rescheduled: 'Rescheduled your inspection',
	call: 'Tried to call you',
	inspection: 'Booked an inspection with you',
	message: 'Messaged you',
	comment: 'Commented on your apartment listing',
	comment_reply: 'Replied your comment',
	profile_view: 'Viewed your profile',
	cancelled: 'Cancelled your inspection',
	bookmark: 'Reserved your apartment listing',
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
