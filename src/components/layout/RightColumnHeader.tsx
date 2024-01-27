'use client'
import { DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'
import { Avatar, Button, Flex, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import AuthPopup from '../popups/AuthPopup'
import { useAuthContext } from '@/context/auth.context'
import Link from 'next/link'
import { FaCoins } from 'react-icons/fa'

export default function RightColumnHeader() {
	const [showLogin, setShowLogin] = useState(false);
	const { authState } = useAuthContext();
	const { user, flat_share_profile } = authState;

	if (user) {
		return (
			<Link href={`/user/${user._id}`}>
				<Flex
					h={NAV_HEIGHT}
					maxH={NAV_HEIGHT}
					pl={DEFAULT_PADDING}
					alignItems={'center'}
					gap={DEFAULT_PADDING}
				>
					<Flex flexDirection={'column'} alignItems={'flex-end'} flex={1}>
						<Text textTransform={'capitalize'}>
							{user.first_name} {user.last_name[0]}.
						</Text>
						<Text display={'flex'} gap={2} alignItems={'center'}>
							<Text color="gold" as="span">
								<FaCoins />
							</Text>
							{flat_share_profile?.credits}
						</Text>
					</Flex>
					<Avatar src={user.avatar_url} />
				</Flex>
			</Link>
		)
	}

	return (
		<>
			{showLogin && <AuthPopup isOpen onClose={() => setShowLogin(false)} />}
			<Flex
				gap={4}
				alignItems={'center'}
				h={NAV_HEIGHT}
				maxH={NAV_HEIGHT}
				justifyContent={'flex-end'}
			>
				<Button
					rounded={'md'}
					px="30px"
					py="10px"
					border={'1px'}
					color={'dark_light'}
					borderColor={'dark_lighter'}
					bg="white"
					_dark={{
						bg: 'dark',
						color: 'dark_lighter',
					}}
					_hover={{
						color: 'dark',
						borderColor: 'dark',
						_dark: {
							color: 'dark_lighter',
							borderColor: 'dark_lighter',
						},
					}}
				>
					Upload
				</Button>
				<Button
					rounded={'md'}
					onClick={() => setShowLogin(true)}
					px="30px"
					py="10px"
					border={'1px'}
					color={'white'}
					borderColor={'dark_lighter'}
					bg="dark"
					_hover={{
						bg: 'brand_darker',
						color: 'accent',
					}}
					_dark={{
						borderColor: 'brand',
						color: 'brand',
					}}
				>
					Login
				</Button>
			</Flex>
		</>
	)
}
