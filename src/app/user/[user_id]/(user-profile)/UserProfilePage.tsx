'use client'

import MainSection from '@/components/atoms/MainSection'
import MobileNavFooter from '@/components/layout/MobileNavFooter'
import { Flex } from '@chakra-ui/react'
import ProfileAboutMe from './ProfileAboutMe'
import ProfileHero from './ProfileHero'
import PersonalInfo from './personal-info/PersonalInfo'
import { db } from '@/firebase'
import { DBCollectionName } from '@/firebase/service/index.firebase'
import {
	collection,
	doc,
	DocumentReference,
	DocumentSnapshot,
	getDoc,
	getDocs,
	query,
	where,
	setDoc,
} from 'firebase/firestore'
import { createDTO } from '@/firebase/service/index.firebase'
import SherutaDB from '@/firebase/service/index.firebase'
import { useEffect } from 'react'
import { saveProfileDocs } from '@/firebase/service/userProfile/user-profile'

interface Props {
	data: any
	flatshareInfos: any
	user_id: string
	profileInfo: any
}

export default async function UserProfilePage({
	data,
	flatshareInfos,
	user_id,
	profileInfo,
}: Props) {
	const userProfile = JSON.parse(flatshareInfos)

	const profileData: createDTO = {
		collection_name: DBCollectionName.userProfile,
		data: profileInfo,
		document_id: user_id,
	}

	useEffect(() => {
		saveProfileDocs(profileData, user_id)
	}, [user_id, profileData])

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
