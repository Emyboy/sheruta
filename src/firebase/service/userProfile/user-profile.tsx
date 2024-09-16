import { collection, getDocs, doc } from 'firebase/firestore'
import { db } from '@/firebase'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'

export const getAllProfileDocs = async (): Promise<any[] | undefined> => {
	try {
		const profileData = await getDocs(
			collection(db, DBCollectionName.userProfile),
		)
		const profileDataArray: any[] = []
		profileData.forEach((doc) => {
			profileDataArray.push(doc.data())
		})
		return profileDataArray
	} catch (e) {
		console.log('Error while trying to retrieve profile collection: ', e)
	}

	getAllProfileDocs
}
