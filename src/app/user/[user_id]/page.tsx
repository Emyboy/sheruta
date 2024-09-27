import MainBackHeader from '@/components/atoms/MainBackHeader'
import { MoreButton } from '@/components/atoms/MoreButton'
import MainContainer from '@/components/layout/MainContainer'
import MainHeader from '@/components/layout/MainHeader'
import MainLeftNav from '@/components/layout/MainLeftNav'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
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
import UserProfilePage from './(user-profile)/UserProfilePage'

export const revalidate = CACHE_TTL.LONG

export default async function page(props: any) {
	const { params } = props
	const { user_id } = params

	async function getUserData() {
		try {
			// const userDoc = await AuthService.getUser(user_id)

			// if (!userDoc) return { user: null }

			// console.log(userDoc)

			// return {
			// 	user: {
			// 		first_name: userDoc.user.first_name,
			// 		last_name: userDoc.user.last_name,
			// 		email: userDoc.user.email,
			// 		avatar_url: userDoc.user.avatar_url,
			// 		id: userDoc.user._id,
			// 	},
			// }

			const userDoc = await getDoc(doc(db, DBCollectionName.users, user_id))
			if (!userDoc.exists()) return { user: null }

			const formattedUserDoc = userDoc.exists() ? userDoc.data() : null

			// console.log(formattedUserDoc)

			return {
				user: formattedUserDoc
					? {
							first_name: formattedUserDoc.first_name,
							last_name: formattedUserDoc.last_name,
							email: formattedUserDoc.email,
							avatar_url: formattedUserDoc.avatar_url,
							id: formattedUserDoc._id,
						}
					: null,
			}
		} catch (error) {
			console.error('Error getting user:', error)
			throw new Error('Failed to get user')
		}
	}

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
				console.error('Error fetching interests:', error)
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
				console.error('Error fetching habits:', error)
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
				console.error('Error fetching Location keyword document:', error)
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
							payment_plan: formattedFlatShareProfile.payment_plan,
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
							is_verified: formattedUserInfoDoc.is_verified,
						}
					: null,
			}

			const plainUser = JSON.stringify(user)

			// const plainUser = user

			return plainUser
		} catch (error) {
			console.error('Error fetching document:', error)
		}
	}

	// const flatshareInfos = await getUserProfile()
	// const user = await getUserData()

	const [user, flatshareInfos] = await Promise.all([
		getUserData(),
		getUserProfile(),
	])

	// const flatshareInfosParsed = flatshareInfos ? JSON.parse(flatshareInfos) : {}

	// const userProfiles = {
	// 	first_name: user.user?.first_name,
	// 	last_name: user.user?.last_name,
	// 	email: user.user?.email,
	// 	avatar_url: user.user?.avatar_url,
	// 	id: user.user?.id,
	// 	occupation: flatshareInfosParsed.flatShareProfile.occupation,
	// 	budget: flatshareInfosParsed.flatShareProfile.budget,
	// 	interests: flatshareInfosParsed.flatShareProfile.interests,
	// 	area: flatshareInfosParsed.flatShareProfile.area,
	// 	habits: flatshareInfosParsed.flatShareProfile.habits,
	// 	work_industry: flatshareInfosParsed.flatShareProfile.work_industry,
	// 	credits: flatshareInfosParsed.flatShareProfile.credits,
	// 	gender_preference: flatshareInfosParsed.flatShareProfile.gender_preference,
	// 	age_preference: flatshareInfosParsed.flatShareProfile.age_preference,
	// 	bio: flatshareInfosParsed.flatShareProfile.bio,
	// 	payment_plan: flatshareInfosParsed.flatShareProfile.payment_plan || null,

	// 	twitter: flatshareInfosParsed.flatShareProfile.socials.twitter,
	// 	tiktok: flatshareInfosParsed.flatShareProfile.socials.tiktok,
	// 	facebook: flatshareInfosParsed.flatShareProfile.socials.facebook,
	// 	linkedin: flatshareInfosParsed.flatShareProfile.socials.linkedin,
	// 	instagram: flatshareInfosParsed.flatShareProfile.socials.instagram,

	// 	state: flatshareInfosParsed.flatShareProfile.state.name,
	// 	seeking: flatshareInfosParsed.flatShareProfile.seeking,
	// 	employment_status: flatshareInfosParsed.flatShareProfile.employment_status,
	// 	religion: flatshareInfosParsed.flatShareProfile.religion,
	// 	done_kyc: flatshareInfosParsed.flatShareProfile.done_kyc,

	// 	whatsapp: flatshareInfosParsed.userInfo.whatsapp,
	// 	phone_number: flatshareInfosParsed.userInfo.phone_number,
	// 	gender: flatshareInfosParsed.userInfo.gender,
	// 	is_verified: flatshareInfosParsed.userInfo.is_verified,
	// 	profilePromo: false,
	// 	document_id: user_id,
	// 	_user_ref: `/users/${user_id}`,
	// }

	const userId = user.user?.id

	// const profileData: CreateDTO = {
	// 	collection_name: DBCollectionName.userProfile,
	// 	data: userProfiles,
	// 	document_id: user_id,
	// }

	// await saveProfileDocs(profileData, user_id)

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
									userId={userId}
									moreButtonList={[{ label: 'share' }, { label: 'promote' }]}
								/>
							</Flex>
						</Box>

						{user ? (
							<UserProfilePage
								data={user}
								flatshareInfos={flatshareInfos}
								user_id={user_id}
								// profileInfo={userProfiles}
							/>
						) : (
							<PageNotFound />
						)}
					</Flex>
				</ThreeColumnLayout>
			</MainContainer>
		</Flex>
	)
}
