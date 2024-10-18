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
import { serverSession } from '@/utils/auth'

export const revalidate = CACHE_TTL.LONG

export default async function page(props: any) {
	const { params } = props
	const { user_id } = params

	const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL
	const fullURL =  `${backendURL}/users/${user_id}`

	try{
     const response = 	await axios.get(
		fullURL,
	  {
		// timeout: 5000,
	  }
	)
	const data = response.data
	const {user} = data
	
	// console.log('This is the user...............',user)
	// const {user, flat_share_profile, user_info} = user

	const userDetails = {
        user: user.user? {
			first_name: user?.user.first_name,
			middle_name: user?.user.middle_name,
			last_name : user?.user.last_name,
			_id : user?.user._id,
			avatar_url: user?.user.avatar_url
		}: null,
		flatShareProfile: user?.flat_share_profile ? {
					// ...formattedFlatShareProfile,
					occupation: user?.flat_share_profile.occupation,
					budget: user?.flat_share_profile.budget,
					interests: user?.flat_share_profile.interests,
					area: user?.flat_share_profile.location.name,
					habits: user?.flat_share_profile.habits,
					work_industry: user?.flat_share_profile.work_industry.name,
					credits: user?.flat_share_profile.credits,
					gender_preference: user?.flat_share_profile.gender_preference,
					age_preference: `${user?.flat_share_profile.age_preference.max} - ${user?.flat_share_profile.age_preference.min}`,
					bio: user?.flat_share_profile.bio,
					payment_type: user?.flat_share_profile.payment_type,
					socials: {
						twitter: user?.flat_share_profile.twitter,
						tiktok: user?.flat_share_profile.tiktok,
						facebook: user?.flat_share_profile.facebook,
						linkedin: user?.flat_share_profile.linkedin,
						instagram: user?.flat_share_profile.instagram,
					},
					state:user?.flat_share_profile.state.name,
					seeking: user?.flat_share_profile.seeking,
					employment_status: user?.flat_share_profile.employment_status,
					religion: user?.flat_share_profile.religion,
					done_kyc: user?.flat_share_profile.done_kyc,
				}
			: null,
		userInfo: user?.user_info
			? {
					// ...formattedUserInfoDoc,
					whatsapp: user?.user_info.whatsapp_phone_number,
					phone_number: user?.user_info.primary_phone_number,
					gender: user?.user_info.gender,
					bio: user?.user_info.bio,
					is_verified: user?.user_info.is_verified,
				}
			: null,
	}

	const plainUser = JSON.stringify(userDetails)

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
							<UserProfilePage user_id={user_id} userInfos={plainUser} 
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


  
