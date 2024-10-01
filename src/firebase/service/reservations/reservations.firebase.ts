import { db } from '@/firebase'
import SherutaDB, { DBCollectionName } from '../index.firebase'
import { ReservationType } from './reservations.types'
import { collection, getDocs, limit, query, where } from 'firebase/firestore'

export default class ReservationService extends SherutaDB {
	static async reserveListing(data: ReservationType) {
		await this.create({
			collection_name: DBCollectionName.reservations,
			data,
			document_id: data.uuid,
		})

		await this.update({
			collection_name: DBCollectionName.flatShareRequests,
			data: {
				availability_status: 'reserved',
				reserved_by: data.reserved_by,
				reservation_expiry: data.endTime,
			},
			document_id: data.request_id,
		})
	}

	static async getPreviousReservation({ user_id }: { user_id: string }) {
		try {
			const reservationsCollection = collection(
				db,
				DBCollectionName.reservations,
			)

			const q = query(
				reservationsCollection,
				where('reserved_by', '==', user_id),
				limit(1),
			)

			const querySnapshot = await getDocs(q)

			if (!querySnapshot.empty) {
				return true
			} else {
				return false
			}
		} catch (error) {
			console.error('Error fetching previous reservation:', error)
			throw new Error('Unable to retrieve previous reservation.')
		}
	}

	static async deleteReservedListing({
		request_id,
		doc_id,
	}: {
		request_id: string
		doc_id: string
	}) {
		await this.delete({
			collection_name: DBCollectionName.reservations,
			document_id: doc_id,
		})
		await this.update({
			collection_name: DBCollectionName.flatShareRequests,
			data: {
				availability_status: 'available',
				reserved_by: null,
				reservation_expiry: null,
			},
			document_id: request_id,
		})
	}
}
