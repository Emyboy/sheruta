import { DocumentData, doc, getDoc, serverTimestamp } from 'firebase/firestore'
import SherutaDB, { DBCollectionName } from '../index.firebase'
import {
	AuthUser,
	AuthUserDTO,
	RegisterDTO,
	RegisterDTOSchema,
} from './auth.types'
import { db } from '@/firebase'
import UserInfoService from '../user-info/user-info.firebase'
import UserSettingsService from '../user-settings/user-settings.firebase'
import FlatShareProfileService from '../flat-share-profile/flat-share-profile.firebase'

export default class AuthService {
	static async loginUser(data: RegisterDTO): Promise<DocumentData | undefined> {
		try {
			RegisterDTOSchema.parse(data)
			let userExists = await this.getUser(data.uid)

			if (userExists) {
				console.log('USER EXIST::', userExists)
				return userExists
			}

			let user: DocumentData | undefined = await this.createNewUser(data)
			return user
		} catch (error) {
			return Promise.reject(error)
		}
	}

	static async createNewUser(
		data: RegisterDTO,
	): Promise<DocumentData | undefined> {
		try {
			const userData: AuthUserDTO = {
				_id: data.uid,
				first_name:
					data.displayName.split(' ')[0].toLocaleLowerCase().trim() ||
					data.displayName.toLowerCase().trim(),
				last_name:
					data.displayName.split(' ')[1].toLocaleLowerCase().trim() ||
					data.displayName.toLowerCase().trim(),
				email: data.email,
				// phone_number: data.phoneNumber,
				account_status: 'active',
				avatar_url: data.photoURL,
				last_seen: serverTimestamp(),
				providerId: data.providerId as 'google',
			}

			await SherutaDB.create({
				collection_name: DBCollectionName.users,
				document_id: data.uid,
				data: userData,
			})

			let _user = await getDoc(doc(db, DBCollectionName.users, data.uid));

			await FlatShareProfileService.create({
				_user_id: data.uid,
				_user_ref: _user.ref
			})

			await UserInfoService.create({
				phone_number: data.phoneNumber,
				_user_id: data.uid,
				_user_ref: _user.ref,
			})

			await UserSettingsService.create({
				_user_ref: _user.ref,
				_user_id: data.uid,
			})

			let user = await this.getUser(data.uid)
			console.log('CREATED USER:::', user)
			return user
		} catch (error) {
			return Promise.reject(error)
		}
	}

	static async getUser(user_id: string): Promise<any | null> {
		try {
			const docRef = doc(db, DBCollectionName.users, user_id)
			const docSnap = await getDoc(docRef)

			if (docSnap.exists()) {
				console.log('Document data:', docSnap.data())
				return docSnap.data()
			} else {
				// docSnap.data() will be undefined in this case
				console.log('No such document!')
				return null
			}
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
