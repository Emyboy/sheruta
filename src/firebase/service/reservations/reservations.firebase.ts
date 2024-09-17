import SherutaDB, { DBCollectionName } from '../index.firebase'
import { ReservationType } from './reservations.types'

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

	static async deleteReservedListing(data: { request_id: string }) {
		await this.update({
			collection_name: DBCollectionName.flatShareRequests,
			data: {
				availability_status: 'available',
				reserved_by: undefined,
				reservation_expiry: undefined,
			},
			document_id: data.request_id,
		})
	}
}
