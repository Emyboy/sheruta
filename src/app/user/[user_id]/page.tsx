import React from 'react'
import UserProfilePage from './(user-profile)/UserProfilePage'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import MainContainer from '@/components/layout/MainContainer'
import { Flex } from '@chakra-ui/react'
import MainLeftNav from '@/components/layout/MainLeftNav'
import MainBackHeader from '@/components/atoms/MainBackHeader'
import PageNotFound from '@/components/PageNotFound'
import { CACHE_TTL } from '@/constants'
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
	DocumentReference,
	DocumentSnapshot,
	DocumentData,
} from 'firebase/firestore'
import { db } from '@/firebase'
import { promise } from 'zod'
import { DBCollectionName } from '@/firebase/service/index.firebase'

export const revalidate = CACHE_TTL.LONG

export default async function page(props: any) {
	const { params } = props
	const { user_id } = params

	async function getUserData() {
		try {
			const userDoc = await getDoc(doc(db, DBCollectionName.users, user_id))

			const formattedUserDoc = userDoc.exists() ? userDoc.data() : null

			console.log(formattedUserDoc)

			return { user: formattedUserDoc }
		} catch (error) {
			console.error('Error getting user profile:', error)
			throw new Error('Failed to get user profile')
		}
	}

	const user = await getUserData()

	async function getUserProfile() {
		try {
			const [flatShareProfileDocs, userInfoDocs] = await Promise.all([
				getDocs(
					query(
						collection(db, DBCollectionName.flatShareProfile),
						where('_user_id', '==', user_id),
					),
				),
				getDocs(
					query(
						collection(db, DBCollectionName.userInfos),
						where('_user_id', '==', user_id),
					),
				),
			])

			const formattedFlatShareProfile = flatShareProfileDocs.docs[0].data()
				? flatShareProfileDocs.docs[0].data()
				: null

			const formattedUserInfoDoc = userInfoDocs.docs[0].data()
				? userInfoDocs.docs[0].data()
				: null

			let interestsData: any = []

			try {
				if (formattedFlatShareProfile?.interests) {
					const arrayDocRef =
						formattedFlatShareProfile.interests as DocumentReference[]

					const docSnapshots = await Promise.all(
						arrayDocRef.map((docRef) => getDoc(docRef)),
					)

					interestsData = docSnapshots
						.map((docSnapshot: DocumentSnapshot) =>
							docSnapshot.exists() ? docSnapshot.data() : null,
						)
						.filter((data) => data !== null)
				}
			} catch (error) {
				console.error('Error fetching document:', error)
			}

			let habitsData: any = []

			try {
				if (formattedFlatShareProfile?.habits) {
					const arrayDocRef =
						formattedFlatShareProfile.habits as DocumentReference[]

					const docSnapshots = await Promise.all(
						arrayDocRef.map((docRef) => getDoc(docRef)),
					)
					habitsData = docSnapshots
						.map((docSnapshot: DocumentSnapshot) =>
							docSnapshot.exists() ? docSnapshot.data() : null,
						)
						.filter((data) => data !== null)
				}
			} catch (error) {
				console.error('Error fetching document:', error)
			}

			let locationValue: any = null

			try {
				const locationKeywordDocRef =
					formattedFlatShareProfile?.location_keyword as DocumentReference

				const docSnapshot = await getDoc(locationKeywordDocRef)

				if (docSnapshot.exists()) {
					locationValue = docSnapshot.data()
				} else {
					console.log('Location keyword document does not exist.')
				}
			} catch (error) {
				console.error('Error fetching document:', error)
			}

			const user = {
				flatShareProfile: formattedFlatShareProfile
					? {
							...formattedFlatShareProfile,
							interests: interestsData,
							area: locationValue,
							habits: habitsData,
						}
					: null,
				userInfo: formattedUserInfoDoc,
			}

			// Convert to JSON and then back to a plain object
			const plainUser = JSON.stringify(user)

			return plainUser
		} catch (error) {
			console.error('Error fetching document:', error)
		}
	}

	const otherInfos = await getUserProfile()

	return (
		<Flex justifyContent={'center'}>
			<MainContainer>
				<ThreeColumnLayout header={<MainBackHeader />}>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>
					{user ? (
						<UserProfilePage data={user} userId={otherInfos} />
					) : (
						<PageNotFound />
					)}
				</ThreeColumnLayout>
			</MainContainer>
		</Flex>
	)
}
