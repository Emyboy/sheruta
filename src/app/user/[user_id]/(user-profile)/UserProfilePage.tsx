import { Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import ProfileHero from './ProfileHero'
import MainSection from '@/components/atoms/MainSection'
import ProfileAboutMe from './ProfileAboutMe'
import PersonalInfo from './personal-info/PersonalInfo'
import EachRequest from '@/components/EachRequest/EachRequest'

interface Props {
	data: any
	userId: any
}

export default async function UserProfilePage({ data, userId }: Props) {
	const userProfile = JSON.parse(userId)


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
		</Flex>
	)
}
