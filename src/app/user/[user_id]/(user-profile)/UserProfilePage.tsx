import MainSection from '@/components/atoms/MainSection'
import MobileNavFooter from '@/components/layout/MobileNavFooter'
import { Flex } from '@chakra-ui/react'
import ProfileAboutMe from './ProfileAboutMe'
import ProfileHero from './ProfileHero'
import PersonalInfo from './personal-info/PersonalInfo'
import { UpdateProfilePopup } from './promoteProfileModal/updateProfileSnippet'
// import EachRequest from '@/components/EachRequest/EachRequest'
// import { HostRequestDataDetails } from '@/firebase/service/request/request.types'

interface Props {
	data: any
	flatshareInfos: any
	user_id: string

}

export default async function UserProfilePage({
	data,
	flatshareInfos,
	user_id,
	
}: Props) {
	const userProfile = JSON.parse(flatshareInfos)


	return (
		<Flex flexDir={'column'}>
			<MainSection>
				<ProfileHero data={data} userProfile={userProfile} user_id={user_id} />
			</MainSection>
			<MainSection heading="About me">
				<ProfileAboutMe userProfile={userProfile} />
			</MainSection>
			<PersonalInfo userProfile={userProfile} />
			<UpdateProfilePopup/>
			<MainSection heading="My Postings" borderBottom={0}>
				{/* <EachRequest request={request} />
				<EachRequest />
				<EachRequest /> */}
			</MainSection>
			<MobileNavFooter />
		</Flex>
	)
}
