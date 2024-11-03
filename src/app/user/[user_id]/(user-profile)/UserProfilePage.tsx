'use client'
import MainSection from '@/components/atoms/MainSection'
import MobileNavFooter from '@/components/layout/MobileNavFooter'
import { Flex } from '@chakra-ui/react'
import ProfileAboutMe from './ProfileAboutMe'
import ProfileHero from './ProfileHero'
import PersonalInfo from './personal-info/PersonalInfo'
import { UpdateProfilePopup } from './promoteProfileModal/updateProfileSnippet'
import { useEffect, useState } from 'react'
import { useAuthContext } from '@/context/auth.context'
import axiosInstance from '@/utils/custom-axios'
import LoginCard from '@/components/atoms/LoginCard'
import {
	BiSolidMessageSquareDetail,
	BiSolidMessageSquareEdit,
} from 'react-icons/bi'
// import EachRequest from '@/components/EachRequest/EachRequest'
// import { HostRequestDataDetails } from '@/firebase/service/request/request.types'

interface Props {
	userInfos: any
	user_id: string
}

export default function UserProfilePage({ userInfos, user_id }: Props) {
	const userProfile = JSON.parse(userInfos)
	const { authState } = useAuthContext()

	let userAuth
	const getUserAuth = () => {
		const { user } = authState
		userAuth = user
	}
	getUserAuth()

	const { user } = userProfile
	const data = user

	return (
		<Flex flexDir={'column'}>
			{userAuth ? (
				<>
					<MainSection>
						<ProfileHero
							data={data}
							userProfile={userProfile}
							user_id={user_id}
						/>
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
				</>
			) : (
				<LoginCard Icon={BiSolidMessageSquareDetail} />
			)}
		</Flex>
	)
}
