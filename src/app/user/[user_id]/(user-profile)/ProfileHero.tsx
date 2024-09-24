'use client'

import { DEFAULT_PADDING } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
import { AuthUser } from '@/firebase/service/auth/auth.types'
import { FlatShareProfileData } from '@/firebase/service/flat-share-profile/flat-share-profile.types'
import { UserInfo } from '@/firebase/service/user-info/user-info.types'
import { handleCall } from '@/utils/index.utils'
import { Box, Button, Flex, Text } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import {
	BiBriefcase,
	BiGroup,
	BiMessageRoundedDetail,
	BiSolidBadgeCheck,
	BiSolidLocationPlus,
	BiStore,
} from 'react-icons/bi'
import { saveProfileDocs } from '@/firebase/service/userProfile/user-profile'
import { createDTO } from '@/firebase/service/index.firebase'
import { use, useEffect } from 'react'
import { DBCollectionName } from '@/firebase/service/index.firebase'

type Props = {
	data: any
	userProfile: any
	user_id: string
	// profileInfo: any
}

export default function ProfileHero({ data, userProfile, user_id }: Props) {
	const _user: AuthUser = data.user
	const userFlatshareProfile: FlatShareProfileData =
		userProfile.flatShareProfile
	const { authState } = useAuthContext()

	// const profileData: createDTO = {
	// 	collection_name: DBCollectionName.userProfile,
	// 	data: userProfile,
	// 	document_id: user_id,
	// }

	// const sendProfile = ()=>{

	// 	useEffect(()=>{

	// 		saveProfileDocs(profileInfo, user_id)

	// 	},[profileData, user_id] )
	// 	console.log('done.....................')
	// }
	// sendProfile()

	const _userInfo: UserInfo = userProfile.userInfo

	return (
		<Flex gap={DEFAULT_PADDING} maxW={'90%'} minW={'60%'}>
			<Box
				position={'relative'}
				w={{
					md: '200px',
					base: '120px',
				}}
				minW={{
					md: '200px',
					base: '150px',
				}}
				h={{
					md: '200px',
					base: '150px',
				}}
				rounded={'md'}
				overflow={'hidden'}
				mr={{
					md: '16px',
					base: '20px',
				}}
				mt={{
					md: '1px',
					base: '20px',
				}}
			>
				<Image
					style={{ position: 'absolute' }}
					src={_user.avatar_url || '/assets/avatar.webp'}
					fill
					alt={'user'}
				/>
			</Box>
			<Flex
				maxW={'full'}
				flexDir={'column'}
				flex={1}
				justifyContent={'flex-end'}
			>
				<Flex maxW={'90%'} alignItems={'center'} gap={1}>
					<Text
						isTruncated
						fontSize={{
							md: 'large',
							base: 'small',
						}}
						textTransform={'capitalize'}
					>
						{_user?.first_name} {_user?.last_name}
					</Text>
					{_userInfo?.is_verified ? (
						<Flex alignItems={'center'} color={'green.400'} h="full">
							<BiSolidBadgeCheck size={25} />
						</Flex>
					) : null}
				</Flex>
				<Flex alignItems={'center'} gap={1} color="text_muted">
					<BiBriefcase />
					<Text as="span" color="text_muted">
						{userFlatshareProfile?.occupation}
					</Text>
				</Flex>
				<Flex alignItems={'center'} gap={1} color="text_muted">
					<BiStore />
					<Text as="span" color="text_muted">
						{userFlatshareProfile?.seeking ? 'Seeker' : 'I have a space'}
					</Text>
				</Flex>
				<Flex alignItems={'center'} gap={1} color="text_muted">
					<BiGroup />
					<Text as="span" color="text_muted">
						{_userInfo?.gender}
					</Text>
				</Flex>
				<Flex
					alignItems={'center'}
					gap={1}
					color="text_muted"
					mb={DEFAULT_PADDING}
				>
					<BiSolidLocationPlus />
					<Text color="text_muted" as={'span'}>
						{`${userProfile.flatShareProfile?.state.name}, Nigeria`}
					</Text>
				</Flex>

				<Flex gap={DEFAULT_PADDING}>
					<Button
					// onClick={async () => {
					// 	if (authState.user?._id === user_id) return
					// 	await handleCall({
					// 		number: _userInfo.primary_phone_number,
					// 		recipient_id: user_id,
					// 		sender_details: authState.user
					// 			? {
					// 					avatar_url: authState.user.avatar_url,
					// 					first_name: authState.user.first_name,
					// 					last_name: authState.user.last_name,
					// 					id: authState.user._id,
					// 				}
					// 			: null,
					// 	})
					// }}
					>
						Call Me
					</Button>
					<Link href={`/messages/${user_id}`}>
						<Button>
							<BiMessageRoundedDetail size={25} />
						</Button>
					</Link>
				</Flex>
			</Flex>
		</Flex>
	)
}
