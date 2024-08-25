import { DocumentData, doc, getDoc } from 'firebase/firestore'
import SherutaDB, { DBCollectionName } from '../index.firebase'
import { UserInfo, UserInfoDTO } from './user-info.types'
import { db } from '@/firebase'

export default class UserInfoService {
	static async create({
		phone_number,
		_user_id,
		_user_ref,
	}: {
		phone_number: string | null
		_user_id: string
		_user_ref: any
	}) {
		try {
			let data: UserInfoDTO = {
				_user_id,
				_user_ref,
				gender: null,
				primary_phone_number: phone_number,
				whatsapp_phone_number: null,
				done_kyc: false,
				is_verified: false,
			}
			let result = await SherutaDB.create({
				collection_name: DBCollectionName.userInfos,
				data,
				document_id: _user_id,
			})

			return result
		} catch (error) {
			return Promise.reject(error)
		}
	}

	static async get(user_id: string): Promise<DocumentData | undefined> {
		try {
			let result = await getDoc(doc(db, DBCollectionName.userInfos, user_id))
			return result.data()
		} catch (error) {
			return Promise.reject(error)
		}
	}

	static async update({
		data,
		document_id,
	}: {
		document_id: string
		data: Partial<UserInfo>
	}): Promise<UserInfo> {
		try {
			let result = await SherutaDB.update({
				collection_name: DBCollectionName.userInfos,
				data,
				document_id,
			})
			return result as UserInfo
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
