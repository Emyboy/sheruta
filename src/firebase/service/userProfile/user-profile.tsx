import {
	collection,
	getDocs,
	doc,
	setDoc,
	getDoc,
	updateDoc,
	serverTimestamp,
	DocumentData,
	deleteDoc,
	where,
	query,
} from 'firebase/firestore'
import { db } from '@/firebase'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import { resolveDocumentReferences } from '@/utils/index.utils'

export const getAllProfileDocs = async (): Promise<any[] | undefined> => {
	try {
		const _limit: number = 10
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
}

export const saveProfileDocs = async (
	profileData: Record<string, any>,
	user_id: string,
): Promise<void> => {
	try {
		const docRef = doc(db, DBCollectionName.userProfile, user_id)
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

export const updateProfileDocs = async (
	profileData: Record<string, any>,
	user_id: string,
): Promise<void> => {
	try {
		const docRef = doc(db, DBCollectionName.userProfile, user_id)
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

export const getProfile = async (
	user_id: string,
): Promise<DocumentData | undefined> => {
	try {
		const docRef = doc(db, DBCollectionName.userProfile, user_id)
		const docSnap = await getDoc(docRef)
		const data = docSnap.data()
		console.log('data:', data)
		return data
	} catch (error) {
		console.log(error)
	}
}

export const deleteProfile = async (user_id: string): Promise<void> => {
	try {
		const docRef = doc(db, DBCollectionName.userProfile, user_id)
		const docSnap = await deleteDoc(docRef)
		return docSnap
	} catch (error) {
		console.log(error)
	}
}

export const getAllProfileSnippetDocs = async (searchParams: {
	work_industry?: string
	gender_preference?: string
	employment_status?: string
	age_preference?: string
}): Promise<any[] | undefined> => {
	try {
		const _limit: number = 10
		let q

		if (searchParams.age_preference) {
			q = query(
				collection(db, DBCollectionName.userProfile),
				where('age_preference', '==', searchParams.age_preference),
			)
		} else if (searchParams.employment_status) {
			q = query(
				collection(db, DBCollectionName.userProfile),
				where('employment_status', '==', searchParams.employment_status),
			)
		} else if (searchParams.gender_preference) {
			q = query(
				collection(db, DBCollectionName.userProfile),
				where('gender_preference', '==', searchParams.gender_preference),
			)
		} else if (searchParams.work_industry) {
			q = query(
				collection(db, DBCollectionName.userProfile),
				where('work_industry', '==', searchParams.work_industry),
			)
		} else {
			q = collection(db, DBCollectionName.userProfile)
		}

		const profileDataSnapshot = await getDocs(q)

		const profileDataArray: any[] = []
		profileDataSnapshot.forEach(async (doc) => {
			const docData = { ...doc.data() }
			const resolvedData = await resolveDocumentReferences(docData)
			profileDataArray.push({ id: doc.id, ...resolvedData, ref: doc.ref })
		})

		return profileDataArray
	} catch (e) {
		console.log('Error while trying to retrieve profile collection: ', e)
	}
}

export const deleteProfileSnippet = async (user_id: string): Promise<void> => {
	try {
		const docRef = doc(db, DBCollectionName.userProfileSnippet, user_id)
		const docSnap = await deleteDoc(docRef)
		return docSnap
	} catch (error) {
		console.log(error)
	}
}

export const saveProfileSnippetDocs = async (
	profileData: Record<string, any>,
	user_id: string,
): Promise<void> => {
	try {
		const docRef = doc(db, DBCollectionName.userProfileSnippet, user_id)

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
