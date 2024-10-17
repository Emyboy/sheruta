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
	profileInfo: any
	user_id: string
}

export default function UserProfilePage({ profileInfo, user_id }: Props) {
	// const userProfile = JSON.parse(flatshareInfos)
	// const {authState} = useAuthContext()
	// console.log('Auth state.................',authState)

	// console.log('Auth state.................',profileInfo)
	// console.log('User id.................',user_id)

	return (
		<Flex flexDir={'column'}>
			{/* <MainSection>
				<ProfileHero data={data} userProfile={userProfile} user_id={user_id} />
			</MainSection>
			<MainSection heading="About me">
				<ProfileAboutMe userProfile={userProfile} />
			</MainSection>
			<PersonalInfo userProfile={userProfile} />
			<UpdateProfilePopup profileOwnerId={user_id} />
			<MainSection heading="My Postings" borderBottom={0}>
				<EachRequest request={request} />
				<EachRequest />
				<EachRequest />
			</MainSection>
			<MobileNavFooter /> */}
		</Flex>
	)
}
