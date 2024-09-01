'use client'

import { DEFAULT_PADDING } from '@/configs/theme'
import { AuthUser } from '@/firebase/service/auth/auth.types'
import { Box, Button, Flex, Text } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {
	BiBriefcase,
	BiMessageRoundedDetail,
	BiSolidBadgeCheck,
	BiSolidLocationPlus,
	BiMaleFemale,
	BiGroup,
	BiStore,
} from 'react-icons/bi'
import { FlatShareProfileData } from '@/firebase/service/flat-share-profile/flat-share-profile.types'
import { UserInfo } from '@/firebase/service/user-info/user-info.types'

type Props = {
	data: any
	userProfile: any
}

export default function ProfileHero({ data, userProfile }: Props) {
	const _user: AuthUser = data.user
	const userFlatshareProfile: FlatShareProfileData =
		userProfile.flatShareProfile

	const _userInfo: UserInfo = userProfile.userInfo

	const handleCall = () => {
		window.location.href = `tel:${_userInfo.primary_phone_number}`
	}

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
					<Text isTruncated fontSize={'x-large'} textTransform={'capitalize'}>
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
						{userFlatshareProfile?.seeking ? 'Seeker' : 'I have an apartment'}
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
						{`${userProfile.flatShareProfile?.area} Nigeria`}
					</Text>
				</Flex>

				<Flex gap={DEFAULT_PADDING}>
					<Button onClick={handleCall}>Call Me</Button>
					<Link href={`/messages/${_user._id}`}>
						<Button>
							<BiMessageRoundedDetail size={25} />
						</Button>
					</Link>
				</Flex>
			</Flex>
		</Flex>
	)
}
