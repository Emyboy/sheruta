import MainSection from '@/components/atoms/MainSection'
import { Flex } from '@chakra-ui/react'
import ProfileAboutMe from './ProfileAboutMe'
import ProfileHero from './ProfileHero'
import PersonalInfo from './personal-info/PersonalInfo'
<<<<<<< HEAD
=======
import EachRequest from '@/components/EachRequest/EachRequest'
import MobileNavFooter from '@/components/layout/MobileNavFooter'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import MainHeader from '@/components/layout/MainHeader'
>>>>>>> 10cb1046be51f220080225b03a9da115feee5df8

interface Props {
	data: any
	userId: any
	user_id: string
}

export default async function UserProfilePage({
	data,
	userId,
	user_id,
}: Props) {
	const userProfile = JSON.parse(userId)

	return (
		<Flex flexDir={'column'}>
			<MainSection>
				<ProfileHero data={data} userProfile={userProfile} user_id={user_id} />
			</MainSection>
			<MainSection heading="About me">
				<ProfileAboutMe userProfile={userProfile} />
			</MainSection>
			<PersonalInfo userProfile={userProfile} />
			<MainSection heading="My Postings" borderBottom={0}>
				{/* <EachRequest />
				<EachRequest />
				<EachRequest /> */}
			</MainSection>
			<MobileNavFooter />
		</Flex>
	)
}
