import {
	DocumentData,
	DocumentReference,
	doc,
	getDoc,
} from 'firebase/firestore'
import SherutaDB, { DBCollectionName } from '../index.firebase'
import {
	FlatShareProfileDTO,
	FlatShareProfileData,
} from './flat-share-profile.types'
import { db } from '@/firebase'

export default class FlatShareProfileService {
	static async create({
		_user_id,
		_user_ref,
	}: {
		_user_id: string
		_user_ref: DocumentReference
	}) {
		try {
			let userInfo = await getDoc(doc(db, DBCollectionName.userInfos, _user_id))
			let data: FlatShareProfileDTO = {
				_user_info_ref: userInfo.ref,
				_user_id,
				budget: null,
				seeking: null,
				_user_ref,
				credits: 0,
				location_keyword: null,
				occupation: null,
				state: null,
			}
			let result = await SherutaDB.create({
				collection_name: DBCollectionName.flatShareProfile,
				data,
				document_id: _user_id,
			})

			return result
		} catch (error) {
			return Promise.reject(error)
		}
	}

	static async get(user_id: string) {
		try {
			let result = await getDoc(
				doc(db, DBCollectionName.flatShareProfile, user_id),
			)
			return result.data()
		} catch (error) {
			return Promise.reject(error)
		}
	}

	static async updateCredit({
		newCredit,
		user_id,
	}: {
		newCredit: number
		user_id: string
		}): Promise<FlatShareProfileData | null> {
		try {
			let result = (await SherutaDB.get({
				collection_name: DBCollectionName.flatShareProfile,
				document_id: user_id,
			})) as FlatShareProfileData

			if (result && newCredit) {
				let update = await SherutaDB.update({
					collection_name: DBCollectionName.flatShareProfile,
					data: { credits: result?.credits + newCredit },
					document_id: user_id,
				})
				return update as FlatShareProfileData;
			}else {
				return null;
			}
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
