import { Flex } from '@chakra-ui/react'
import React from 'react'
import ProfileHero from './ProfileHero'
import MainSection from '@/components/atoms/MainSection'
import ProfileAboutMe from './ProfileAboutMe'
import PersonalInfo from './personal-info/PersonalInfo'
import EachRequest from '@/components/EachRequest/EachRequest'

type Props = {
	data: any
}

export default function UserProfilePage({ data }: Props) {
	return (
		<Flex flexDir={'column'}>
			<MainSection>
				<ProfileHero data={data} />
			</MainSection>
			<MainSection heading="About me">
				<ProfileAboutMe />
			</MainSection>
			<PersonalInfo />
			<MainSection heading="My Postings" borderBottom={0}>
				<EachRequest />
				<EachRequest />
				<EachRequest />
			</MainSection>
		</Flex>
	)
}
