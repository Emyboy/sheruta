import SherutaDB, { DBCollectionName } from '../index.firebase'

export default class UserSettingsService {
	static defaultSettings = {
		marketing_email: true,
		platform_update: true,
		flat_share_update: true,
	}

	static async create({
		_user_id,
		_user_ref,
	}: {
		_user_id: string
		_user_ref: any
	}) {
		try {
			let result = await SherutaDB.create({
				collection_name: DBCollectionName.userSettings,
				data: {
					...this.defaultSettings,
					_user_id,
					_user_ref,
				},
				document_id: _user_id,
			})

			return result
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
