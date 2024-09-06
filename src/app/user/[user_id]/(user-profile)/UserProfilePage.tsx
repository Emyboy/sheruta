import { Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import ProfileHero from './ProfileHero'
import MainSection from '@/components/atoms/MainSection'
import ProfileAboutMe from './ProfileAboutMe'
import PersonalInfo from './personal-info/PersonalInfo'
import EachRequest from '@/components/EachRequest/EachRequest'
import MobileNavFooter from '@/components/layout/MobileNavFooter'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import MainHeader from '@/components/layout/MainHeader'

interface Props {
	data: any
	userId: any
}

export default async function UserProfilePage({ data, userId }: Props) {
	const userProfile = JSON.parse(userId)

	// console.log(userProfile.flatShareProfile?.state.name)

	return (
		<Flex flexDir={'column'}>
			<MainSection>
				<ProfileHero data={data} userProfile={userProfile} />
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
