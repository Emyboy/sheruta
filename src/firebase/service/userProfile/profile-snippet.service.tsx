import {
	collection,
	getDocs,
	doc,
	setDoc,
	getDoc,
	updateDoc,
	serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/firebase'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'

export const getAllProfileSnippetDocs = async (): Promise<
	any[] | undefined
> => {
	try {
		const _limit: number = 10
		const profileData = await getDocs(
			collection(db, DBCollectionName.userProfileSnippet),
		)
		const profileDataArray: any[] = []
		profileData.forEach((doc) => {
			profileDataArray.push(doc.data())
		})
		return profileDataArray
	} catch (e) {
		console.log('Error while trying to retrieve profile collection: ', e)
	}
}

export const saveProfileSnippetDocs = async (
	profileData: Record<string, any>,
	user_id: string,
): Promise<void> => {
	try {
		const docRef = doc(db, DBCollectionName.userProfileSnippet, user_id)
		const docSnap = await getDoc(docRef)

		await setDoc(
			docRef,
			{
				...profileData,
			},
			{ merge: true },
		)
	} catch (error) {
		console.log('Error saving user profile data', error)
	}
}

export const updateProfileSnippetDocs = async (
	profileData: Record<string, any>,
	user_id: string,
): Promise<void> => {
	try {
		const docRef = doc(db, DBCollectionName.userProfileSnippet, user_id)
		const docSnap = await updateDoc(docRef, {
			...profileData,
			updatedAt: serverTimestamp(),
		})
		const data = docSnap
		console.log(data)
	} catch (error) {
		console.log(error)
	}
}
