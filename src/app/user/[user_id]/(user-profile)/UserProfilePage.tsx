import { Flex } from '@chakra-ui/react'
import React from 'react'
import ProfileHero from './ProfileHero'
import MainSection from '@/components/atoms/MainSection'
import ProfileAboutMe from './ProfileAboutMe'
import PersonalInfo from './personal-info/PersonalInfo'
import EachRequest from '@/components/EachRequest/EachRequest'

type Props = {}

export default function UserProfilePage({}: Props) {
	return (
		<Flex flexDir={'column'}>
			<MainSection>
				<ProfileHero />
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
