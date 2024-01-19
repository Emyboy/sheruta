import { Flex } from '@chakra-ui/react'
import React from 'react'
import ProfileHero from './ProfileHero'
import { DEFAULT_PADDING } from '@/configs/theme'
import MainSection from '@/components/atoms/MainSection'
import ProfileAboutMe from './ProfileAboutMe'

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
			<MainSection>
				<ProfileHero />
			</MainSection>
			<MainSection>
				<ProfileHero />
			</MainSection>
		</Flex>
	)
}
