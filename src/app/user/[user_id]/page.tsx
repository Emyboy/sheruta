import MainBackHeader from '@/components/atoms/MainBackHeader'
import { MoreButton } from '@/components/atoms/MoreButton'
import MainContainer from '@/components/layout/MainContainer'
import MainHeader from '@/components/layout/MainHeader'
import MainLeftNav from '@/components/layout/MainLeftNav'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import UserProfilePage from './(user-profile)/UserProfilePage'

import PageNotFound from '@/components/PageNotFound'
import { CACHE_TTL } from '@/constants'
import { db } from '@/firebase'
import { DBCollectionName } from '@/firebase/service/index.firebase'
import { Box, Flex } from '@chakra-ui/react'
import {
	collection,
	doc,
	DocumentReference,
	DocumentSnapshot,
	getDoc,
	getDocs,
	query,
	where,
} from 'firebase/firestore'

export const revalidate = CACHE_TTL.LONG

export default async function page(props: any) {
	const { params } = props
	const { user_id } = params

	async function getUserData() {
		try {
			const userDoc = await getDoc(doc(db, DBCollectionName.users, user_id))

			const formattedUserDoc = userDoc.exists() ? userDoc.data() : null

			// console.log('Basic user profile:...............',formattedUserDoc)

			return {
				user: formattedUserDoc
					? {
							first_name: formattedUserDoc.first_name,
							last_name: formattedUserDoc.last_name,
							email: formattedUserDoc.email,
							avatar_url: formattedUserDoc.avatar_url,
						}
					: null,
			}
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

			// console.log('FS profile:...............',formattedFlatShareProfile)
			// console.log('User info:...............',formattedUserInfoDoc)

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

			let stateValue: any = null

			try {
				const stateDocRef =
					formattedFlatShareProfile?.state as DocumentReference

				const docSnapshot = await getDoc(stateDocRef)

				if (docSnapshot.exists()) {
					stateValue = docSnapshot.data()
				} else {
					console.log('state document does not exist.')
				}
			} catch (error) {
				console.error('Error fetching state document ref:', error)
			}

			const user = {
				flatShareProfile: formattedFlatShareProfile
					? {
							// ...formattedFlatShareProfile,
							occupation: formattedFlatShareProfile.occupation,
							budget: formattedFlatShareProfile.budget,
							interests: interestsData,
							area: locationValue.name,
							habits: habitsData,
							work_industry: formattedFlatShareProfile.work_industry,
							credits: formattedFlatShareProfile.credits,
							gender_preference: formattedFlatShareProfile.gender_preference,
							age_preference: formattedFlatShareProfile.age_preference,
							bio: formattedFlatShareProfile.bio,
							payment_type: formattedFlatShareProfile.payment_type,
							socials: {
								twitter: formattedFlatShareProfile.twitter,
								tiktok: formattedFlatShareProfile.tiktok,
								facebook: formattedFlatShareProfile.facebook,
								linkedin: formattedFlatShareProfile.linkedin,
								instagram: formattedFlatShareProfile.instagram,
							},
							state: stateValue,
							seeking: formattedFlatShareProfile.seeking,
							employment_status: formattedFlatShareProfile.employment_status,
							religion: formattedFlatShareProfile.religion,
							done_kyc: formattedFlatShareProfile.done_kyc,
						}
					: null,
				userInfo: formattedUserInfoDoc
					? {
							// ...formattedUserInfoDoc,
							whatsapp: formattedUserInfoDoc.whatsapp_phone_number,
							phone_number: formattedUserInfoDoc.primary_phone_number,
							gender: formattedUserInfoDoc.gender,
							bio: formattedUserInfoDoc.bio,
							is_verified: formattedUserInfoDoc.is_verified,
						}
					: null,
			}

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
				<ThreeColumnLayout header={<MainHeader />}>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>

					<Flex flexDirection={'column'} w="full">
						<Box my={3}>
							<Flex alignContent={'center'}>
								<MainBackHeader />
								<MoreButton
									userId={user_id}
									moreButtonList={[{ label: 'share' }, { label: 'promote' }]}
								/>
							</Flex>
						</Box>

						{user ? (
							<UserProfilePage
								data={user}
								flatshareInfos={otherInfos}
								user_id={user_id}
								// profileInfo={userProfiles}
							/>
						) : (
							<PageNotFound />
						)}
					</Flex>
					{/* {user ? (
						<UserProfilePage
							data={user}
							userId={otherInfos}
							user_id={user_id}
						/>
					) : (
						<PageNotFound />
					)} */}
				</ThreeColumnLayout>
			</MainContainer>
		</Flex>
	)
}
