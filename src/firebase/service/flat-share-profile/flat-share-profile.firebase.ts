import { DocumentReference, doc, getDoc } from 'firebase/firestore'
import SherutaDB, { DBCollectionName } from '../index.firebase'
import {
	FlatShareProfileData,
	flatShareProfileDefaults,
	UpdateFlatShareProfileDataDTO,
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
			let data: FlatShareProfileData = {
				...flatShareProfileDefaults,
				_user_info_ref: userInfo.ref,
				_user_id,
				_user_ref,
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

	static async incrementCredit({
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
				return update as FlatShareProfileData
			} else {
				return null
			}
		} catch (error) {
			return Promise.reject(error)
		}
	}

	static async decrementCredit({
		user_id,
		amount,
	}: {
		user_id: string
		amount: number
	}): Promise<FlatShareProfileData | null> {
		try {
			let result = (await SherutaDB.get({
				collection_name: DBCollectionName.flatShareProfile,
				document_id: user_id,
			})) as FlatShareProfileData

			if (result && amount && result?.credits >= amount) {
				let update = await SherutaDB.update({
					collection_name: DBCollectionName.flatShareProfile,
					data: { credits: result?.credits - amount },
					document_id: user_id,
				})
				return update as FlatShareProfileData
			} else {
				return Promise.reject(null)
			}
		} catch (error) {
			return Promise.reject(error)
		}
	}

	static async update({
		document_id,
		data,
	}: {
		document_id: string
		data: Partial<UpdateFlatShareProfileDataDTO>
	}): Promise<FlatShareProfileData> {
		try {
			let result = await SherutaDB.update({
				collection_name: DBCollectionName.flatShareProfile,
				data,
				document_id,
			})
			return result as FlatShareProfileData
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
