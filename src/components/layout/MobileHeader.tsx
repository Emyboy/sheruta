'use client'
import { Button, Flex, Show, Text, useColorMode } from '@chakra-ui/react'
import React from 'react'
import MainBodyContent from './MainBodyContent'
import { DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'
import NextLink from 'next/link'
import MainIconBtn from '../atoms/MainIconBtn'
import { BiMenuAltLeft } from 'react-icons/bi'
import { usePathname } from 'next/navigation'
import { FaCoins } from 'react-icons/fa'
import { formatPrice } from '@/utils/index.utils'
import { useAuthContext } from '@/context/auth.context'

type Props = {}

export default function MobileHeader({}: Props) {
	const { colorMode } = useColorMode()
	const pathname = usePathname()
	const { authState, loginWithGoogle } = useAuthContext()
	const { user, flat_share_profile } = authState

	return (
		<Show below="lg">
			<Flex
				borderBottom={'1px'}
				borderColor={'border_color'}
				justifyContent={'center'}
				h="full"
				bg="white"
				_dark={{
					bg: 'dark',
					borderColor: 'dark_light',
				}}
			>
				<MainBodyContent
					flexDirection={'row'}
					alignItems={'center'}
					justifyContent={'space-between'}
					px={DEFAULT_PADDING}
				>
					<Flex flex={1} alignItems={'center'} justifyContent={'space-between'}>
						<MainIconBtn
							label="Open menu"
							Icon={BiMenuAltLeft}
							active={false}
						/>
						<NextLink href="/">
							<Flex
								gap={3}
								alignItems={'center'}
								h={NAV_HEIGHT}
								maxH={NAV_HEIGHT}
							>
								<img src="/icon_green.png" alt="sheruta ng" width={25} />
								{colorMode === 'dark' ? (
									<img
										src="/logo_text_white.png"
										alt="sheruta ng"
										width={100}
									/>
								) : (
									<img
										src="/logo_text_black.png"
										alt="sheruta ng"
										width={100}
									/>
								)}
							</Flex>
						</NextLink>
						{!user ? (
							<Button
								bg="none"
								border={'1px'}
								borderColor={'border_color'}
								_dark={{
									borderColor: 'dark_light',
								}}
								onClick={loginWithGoogle}
								color='dark_lighter'
							>
								Login
							</Button>
						) : (
							<Text display={'flex'} gap={2} alignItems={'center'}>
								<Text color="gold" as="span">
									<FaCoins />
								</Text>
								{formatPrice(flat_share_profile?.credits || 0)}
							</Text>
						)}
					</Flex>
				</MainBodyContent>
			</Flex>
		</Show>
	)
}
