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
import axios from 'axios'
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
import { useAuthContext } from '@/context/auth.context'
import axiosInstance from '@/utils/custom-axios'

export const revalidate = CACHE_TTL.LONG

export default async function page(props: any) {
	const { params } = props
	const { user_id } = params

	console.log('user id........', user_id)
	console.log('user params........', params)

	const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL
	const fullURL =  `${backendURL}/users/${user_id}`

	console.log('Full URL........', fullURL)


	try{
     const response = 	await axios.get(
		fullURL,
	  {
		timeout: 5000,
	  }
	)
	const data = response.data
	const {user} = data
	// console.log('This is the user...............',user.flat_share_profile)
	// const {user, flat_share_profile, user_info} = user

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
							<UserProfilePage user_id={user_id} userBasics={user.user} 
							flatshareInfo={user.flat_share_profile}
							userInfo={user.user_info}
							/>
						) : (
							<PageNotFound />
						)}
					</Flex>
				</ThreeColumnLayout>
			</MainContainer>
		</Flex>
	)
	
	} catch(error)
	{
		let errorMessage = 'An unexpected error occurred.';
    
		
		if (axios.isAxiosError(error) && error.response) {
		  errorMessage = error.response.data.message || 'API error occurred.';
		} else if (error instanceof Error) {
		  errorMessage = error.message;
		}
	
		return <p>Error fetching user data: {errorMessage}</p>;
	}

	




}


  
