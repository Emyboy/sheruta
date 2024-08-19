

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
} from 'firebase/firestore'
import { db } from '@/firebase'
import { promise } from 'zod'
import { DBCollectionName } from '@/firebase/service/index.firebase'

export const revalidate = CACHE_TTL.LONG

export default async function page(props: any) {
	const { params } = props
	const { user_id } = params
	

	async function getUserProfile() {
		try {
			const [flatShareProfileDocs, userDoc, userInfoDocs] = await Promise.all([

				getDocs(
					query(
						collection(db, DBCollectionName.flatShareProfile),
						where('_user_id', '==', user_id),
					),
				),
				getDoc(doc(db, DBCollectionName.users, user_id)),
				getDocs(
					query(
						collection(db, DBCollectionName.userInfos),
						where('_user_id', '==', user_id),
					),
				),
			])

			const formattedFlatShareProfile = flatShareProfileDocs.empty
				? null
				: flatShareProfileDocs.docs[0].data()
			const formattedUserDoc = userDoc.exists() ? userDoc.data() : null
			const formattedUserInfoDoc = userInfoDocs.empty
				? null
				: userInfoDocs.docs[0].data()

			let interestsData: any = []

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

			return {
				flatShareProfile: formattedFlatShareProfile
					? {
							...formattedFlatShareProfile,
							interests: interestsData,
							area: locationValue,
						}
					: null,
				user: formattedUserDoc,
				userInfo: formattedUserInfoDoc,
			}
		} catch (error) {
			console.error('Error getting user profile:', error)
			throw new Error('Failed to get user profile')
		}
	}

	const user = await getUserProfile()
	console.log(
		'Flatshare....................:',
		user.flatShareProfile,
		'User...........................:',
		user.user,
		'User Info:..........................:',
		user.userInfo,
	)

	// const handleCall = () => {
	// 	const phoneNumber = user.userInfo?.primary_phone_number;
		
	// 	if (phoneNumber) {
	// 	  window.location.href = `tel:${phoneNumber}`;
	// 	} else {
	// 	  console.error("Phone number is null or undefined.");
	// 	}
	//   };

	return (
		<Flex justifyContent={'center'}>
			<MainContainer>
				<ThreeColumnLayout header={<MainBackHeader />}>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>
					{user ? <UserProfilePage data={user}/> : <PageNotFound />}
				</ThreeColumnLayout>
			</MainContainer>
		</Flex>
	)
}
