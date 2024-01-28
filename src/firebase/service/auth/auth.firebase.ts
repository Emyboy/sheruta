import { DocumentData, doc, getDoc, serverTimestamp } from 'firebase/firestore'
import SherutaDB, { DBCollectionName } from '../index.firebase'
import { AuthUserDTO, RegisterDTO, RegisterDTOSchema } from './auth.types'
import { db } from '@/firebase'
import UserInfoService from '../user-info/user-info.firebase'
import UserSettingsService from '../user-settings/user-settings.firebase'
import FlatShareProfileService from '../flat-share-profile/flat-share-profile.firebase'
import UserSecretsService from '../user-secrets/user-secrets.firebase'

export default class AuthService {
	static async loginUser(data: RegisterDTO): Promise<DocumentData | undefined> {
		try {
			RegisterDTOSchema.parse(data)
			let userExists = await this.getUser(data.uid)

			if (userExists) {
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
				last_seen: new Date().toISOString(),
				providerId: data.providerId as 'google',
			}

			await SherutaDB.create({
				collection_name: DBCollectionName.users,
				document_id: data.uid,
				data: userData,
			})

			let _user = await getDoc(doc(db, DBCollectionName.users, data.uid))

			await FlatShareProfileService.create({
				_user_id: data.uid,
				_user_ref: _user.ref,
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

			await UserSecretsService.create({
				_user_id: data.uid,
				_user_ref: _user.ref,
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
				let user_info = await UserInfoService.get(user_id)
				let user_settings = await UserSettingsService.get(user_id)
				let flat_share_profile = await FlatShareProfileService.get(user_id)
				return {
					user: docSnap.data(),
					user_info,
					user_settings,
					flat_share_profile,
				}
			} else {
				return null
			}
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
