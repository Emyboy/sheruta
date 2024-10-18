'use client'
import MainSection from '@/components/atoms/MainSection'
import MobileNavFooter from '@/components/layout/MobileNavFooter'
import { Flex } from '@chakra-ui/react'
import ProfileAboutMe from './ProfileAboutMe'
import ProfileHero from './ProfileHero'
import PersonalInfo from './personal-info/PersonalInfo'
import { UpdateProfilePopup } from './promoteProfileModal/updateProfileSnippet'
import { useAuthContext } from '@/context/auth.context'
import axiosInstance from '@/utils/custom-axios'
// import EachRequest from '@/components/EachRequest/EachRequest'
// import { HostRequestDataDetails } from '@/firebase/service/request/request.types'

interface Props {
	userBasics: any
	userInfo: any
	flatshareInfo:any
	user_id: string
}

export default function UserProfilePage({ userInfo, user_id, flatshareInfo, userBasics }: Props) {
	// const userProfile = JSON.parse(flatshareInfos)
	// const {authState} = useAuthContext()
	// console.log('Auth state.................',authState)
    
	// console.log('user Basics.................',userBasics)
	// console.log('user info.................',userInfo)
	// console.log('flatshare info.................',flatshareInfo)
	// console.log('User id.................',user_id)
    
	return null
	return (
		<Flex flexDir={'column'}>
			<MainSection>
				<ProfileHero data={data} userProfile={userProfile} user_id={user_id} />
			</MainSection>
			<MainSection heading="About me">
				<ProfileAboutMe userProfile={userProfile} />
			</MainSection>
			<PersonalInfo userProfile={userProfile} />
			<UpdateProfilePopup profileOwnerId={user_id} />
			<MainSection heading="My Postings" borderBottom={0}>
				{/* <EachRequest request={request} />
				<EachRequest />
				<EachRequest /> */}
			</MainSection>
			<MobileNavFooter />
		</Flex>
	)
}
