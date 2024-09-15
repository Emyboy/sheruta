import SherutaDB, { DBCollectionName } from '../index.firebase'

export default class RequestService extends SherutaDB {
	static async reserveListing(document_id: string) {
		await this.update({
			collection_name: DBCollectionName.flatShareRequests,
			data: { availability_status: 'reserved' },
			document_id,
		})
	}
}
