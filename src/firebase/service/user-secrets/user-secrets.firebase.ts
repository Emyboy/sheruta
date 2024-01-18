import { DocumentReference } from 'firebase/firestore'
import SherutaDB, { DBCollectionName } from '../index.firebase'
import { UserSecretsDTO } from './user-secrets.types'

export default class UserSecretsService {
	static async create({
		_user_id,
		_user_ref,
	}: {
		_user_id: string
		_user_ref: DocumentReference
	}) {
		try {
			let data: UserSecretsDTO = {
				_user_id,
				_user_ref,
				id_number: null,
				transaction_code: null,
			}
			let result = await SherutaDB.create({
				collection_name: DBCollectionName.userSecrets,
				data,
				document_id: _user_id,
			})

			return result
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
