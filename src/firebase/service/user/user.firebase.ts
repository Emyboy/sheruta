import { AuthUser } from '../auth/auth.types'
import SherutaDB, { DBCollectionName } from '../index.firebase'

export default class UserService {
	static async update({
		document_id,
		data,
	}: {
		document_id: string
		data: Partial<AuthUser>
	}): Promise<AuthUser> {
		try {
			let result = await SherutaDB.update({
				collection_name: DBCollectionName.users,
				data,
				document_id,
			})
			return result as AuthUser
		} catch (error) {
			return Promise.reject(error)
		}
	}

	static async get(user_id:string) {
		try {
			
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
