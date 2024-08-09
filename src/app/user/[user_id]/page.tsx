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
} from 'firebase/firestore'
import { db } from '@/firebase'

export const revalidate = CACHE_TTL.LONG

export default async function page(props: any) {
	const { params } = props
	const { user_id } = params
	const emekasId =  'J5vmicZSnmZDDk2iqKskCIEPFhe2';

	async function getUserProfile() {
		try {
			const flatShareProfilesSnapshot = await getDoc(
				doc(db, 'flat_share_profiles', emekasId)
			);
			const flat_share_profiles = flatShareProfilesSnapshot.data()
			const [flatShareProfileDocs, userDoc, userInfoDocs] = await Promise.all([
				// getDocs(
				// 	query(
				// 		collection(db, 'flatShareProfile'),
				// 		where('_user_id', '==', user_id),
				// 	),
				// ),
				// getDoc(doc(db, 'users', user_id)),
				// getDocs(
				// 	query(collection(db, 'userInfos'), where('_user_id', '==', user_id)),
				// ),
				getDocs(
					query(
						collection(db, 'flatShareProfile'),
						where('_user_id', '==', user_id),
					),
				),
				getDoc(doc(db, 'users', user_id)),
				getDocs(
					query(collection(db, 'userInfos'), where('_user_id', '==', user_id)),
				),
			])

			const formattedFlatShareProfile = flatShareProfileDocs.empty
				? null
				: flatShareProfileDocs.docs[0].data()
			const formattedUserDoc = userDoc.exists() ? userDoc.data() : null
			const formattedUserInfoDoc = userInfoDocs.empty
				? null
				: userInfoDocs.docs[0].data()

			// console.log(
			// 	'Expected data:',
			// 	flatShareProfileDocs,
			// 	userDoc,
			// 	userInfoDocs,
			// )
			console.log(
				'fltatshare profile:......................................................:',
		
				flat_share_profiles,
				
			)

			return {
				flatShareProfile: formattedFlatShareProfile,
				user: formattedUserDoc,
				userInfo: formattedUserInfoDoc,
			}
		} catch (error) {
			console.error('Error getting user profile:', error)
			throw new Error('Failed to get user profile')
		}
	}

	const user = await getUserProfile()
	console.log('user profile:', user)

	return (
		<Flex justifyContent={'center'}>
			<MainContainer>
				<ThreeColumnLayout header={<MainBackHeader />}>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>
					{user ? <UserProfilePage data={user} /> : <PageNotFound />}
				</ThreeColumnLayout>
			</MainContainer>
		</Flex>
	)
}
