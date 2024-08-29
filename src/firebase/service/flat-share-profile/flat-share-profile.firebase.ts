import { db } from '@/firebase'
import {
	doc,
	DocumentReference,
	getDoc,
	increment,
	updateDoc,
} from 'firebase/firestore'
import SherutaDB, { DBCollectionName } from '../index.firebase'
import {
	FlatShareProfileData,
	flatShareProfileDefaults,
	UpdateFlatShareProfileDataDTO,
} from './flat-share-profile.types'

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

	static async incrementCredit(data: {
		collection_name: string
		document_id: string
		newCredit: number
	}): Promise<boolean> {
		const ref = doc(db, data.collection_name, data.document_id)

		try {
			await updateDoc(ref, {
				credits: increment(data.newCredit),
			})
			return Promise.resolve(true)
		} catch (error) {
			return Promise.resolve(false)
		}
	}

	static async decrementCredit(data: {
		collection_name: string
		document_id: string
		newCredit: number
	}): Promise<boolean> {
		const ref = doc(db, data.collection_name, data.document_id)

		try {
			await updateDoc(ref, {
				credits: increment(data.newCredit * -1),
			})
			return Promise.resolve(true)
		} catch (error) {
			return Promise.resolve(false)
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
