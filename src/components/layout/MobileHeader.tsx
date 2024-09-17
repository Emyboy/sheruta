'use client'
import {
	Avatar,
	Box,
	Button,
	Flex,
	Show,
	Text,
	useColorMode,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import MainBodyContent from './MainBodyContent'
import { DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'
import NextLink from 'next/link'
import MainIconBtn from '../atoms/MainIconBtn'
import { BiMenuAltLeft } from 'react-icons/bi'
import { FaCoins } from 'react-icons/fa'
import { formatPrice } from '@/utils/index.utils'
import { useAuthContext } from '@/context/auth.context'
import MainLeftNav from './MainLeftNav'
import { useAppContext } from '@/context/app.context'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SearchPageFilter from '@/app/search/(components)/SearchPageFilter'
import MainTooltip from '../atoms/MainTooltip'
import { AiOutlineSwap } from 'react-icons/ai'

type Props = {}

export default function MobileHeader({}: Props) {
	const { colorMode } = useColorMode()
	const { authState, loginWithGoogle } = useAuthContext()
	const { user, flat_share_profile } = authState
	const { setAppState } = useAppContext()

	const pathname = usePathname()

	useEffect(() => {
		if (pathname.startsWith('/search')) setAppState({ show_left_nav: true })
	}, [])

	return (
		<Show below="lg">
			<Drawer />
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
						<Flex w="100px">
							<MainIconBtn
								label=""
								Icon={BiMenuAltLeft}
								active={false}
								onClick={() => setAppState({ show_left_nav: true })}
							/>
						</Flex>

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
						<Flex w="100px" justifyContent={'flex-end'}>
							{!user ? (
								<Button
									bg="none"
									border={'1px'}
									borderColor={'border_color'}
									_dark={{
										borderColor: 'dark_light',
									}}
									onClick={loginWithGoogle}
									color="dark_lighter"
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
					</Flex>
				</MainBodyContent>
			</Flex>
		</Show>
	)
}

const Drawer = () => {
	const { appState, setAppState } = useAppContext()
	const { show_left_nav } = appState
	const pathname = usePathname()

	const [toogleSideNav, setToogleSideNav] = useState<boolean>(
		pathname.startsWith('/search') ? true : false,
	)

	return (
		<>
			<Box
				bg="dark"
				w={'80vw'}
				maxW={'80vw'}
				position={'fixed'}
				top={0}
				bottom={0}
				left={show_left_nav ? 0 : -500}
				transition="left 0.3s ease-in-out"
				zIndex={100}
				shadow="lg"
				borderRight={'1px'}
				borderColor={'border_color'}
				_dark={{
					borderColor: 'dark_light',
				}}
				overflowY={'auto'}
			>
				<Flex flexDirection={'column'} w="full">
					<NavProfile />
					<Box p={DEFAULT_PADDING}>
						{pathname.startsWith('/search') && (
							<MainIconBtn
								label={
									toogleSideNav
										? 'Switch to side nav'
										: 'Switch to search filter'
								}
								Icon={AiOutlineSwap}
								active={false}
								onClick={() => setToogleSideNav((prev) => !prev)}
							/>
						)}
						{toogleSideNav ? <SearchPageFilter /> : <MainLeftNav />}
					</Box>
				</Flex>
			</Box>
			{show_left_nav && (
				<Box
					className="overlay"
					onClick={() => setAppState({ show_left_nav: false })}
					position={'fixed'}
					top={0}
					left={0}
					right={0}
					bottom={0}
					zIndex={80}
					opacity={0.4}
				/>
			)}
		</>
	)
}

const NavProfile = () => {
	const { authState } = useAuthContext()
	const { setAppState } = useAppContext()

	const { user } = authState
	if (!user) {
		return null
	}
	return (
		<Link href={`/user/${user._id}`}>
			<Flex
				onClick={() => setAppState({ show_left_nav: false })}
				minH={NAV_HEIGHT}
				borderBottom={'1px'}
				borderColor={'border_color'}
				_dark={{
					borderColor: 'dark_light',
					bgColor: 'dark',
				}}
				alignItems={'center'}
				gap={DEFAULT_PADDING}
				maxW="99%"
				px={DEFAULT_PADDING}
			>
				<Avatar src={user?.avatar_url} />
				<Flex flex={1} maxW="80%" flexDir={'column'}>
					<Text textTransform={'capitalize'} isTruncated>
						{user?.first_name} {user?.last_name[0]}
					</Text>
					<Text
						display={'flex'}
						fontSize={'sm'}
						isTruncated
						gap={2}
						alignItems={'center'}
					>
						{user?.email}
					</Text>
				</Flex>
			</Flex>
		</Link>
	)
}
