import { doc, getDoc } from 'firebase/firestore'
import { AuthUser } from '../auth/auth.types'
import SherutaDB, { DBCollectionName } from '../index.firebase'
import { db } from '@/firebase'

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

	static async get(user_id: string) {
		try {
			let result = await getDoc(doc(db, DBCollectionName.users, user_id))
			return result.data()
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
