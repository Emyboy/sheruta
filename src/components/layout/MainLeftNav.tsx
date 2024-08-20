'use client'
import { DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'
import { useAppContext } from '@/context/app.context'
import { useAuthContext } from '@/context/auth.context'
import { Box, Divider, Flex, Hide, Text, Icon } from '@chakra-ui/react'
import React from 'react'
import {
	BiCalendarAlt,
	BiCheckShield,
	BiLogInCircle,
	BiMessageSquareDetail,
	BiRocket,
	BiWallet,
	BiWrench,
} from 'react-icons/bi'
import Link from 'next/link'

type Props = {}

export default function MainLeftNav({}: Props) {
	const { logout } = useAuthContext()
	return (
		<Flex
			flexDirection={'column'}
			w={{
				lg: `calc(100% - ${DEFAULT_PADDING})`,
			}}
			minH={`calc(100vh - ${NAV_HEIGHT})`}
			gap={`calc(${DEFAULT_PADDING})`}
			py={DEFAULT_PADDING}
			alignItems={{
				lg: 'flex-start',
				bse: 'center',
			}}
		>
			<Link href={'/groups'}>
				<EachNav Icon={BiMessageSquareDetail} label="Chat rooms" />
			</Link>
			<EachNav Icon={BiCalendarAlt} label="Inspections" />
			<EachNav Icon={BiWallet} label="Wallet" />
			<EachNav Icon={BiWrench} label="Settings" />
			<Link href="/verification">
				<EachNav Icon={BiCheckShield} label="Verification" />
			</Link>
			<Divider
				color="border_color"
				_dark={{
					bg: 'dark_light',
				}}
			/>
			<a href="/">
				<EachNav Icon={BiLogInCircle} label="Logout" onClick={logout} />
			</a>
		</Flex>
	)
}

const EachNav = ({
	Icon,
	label,
	onClick,
}: {
	Icon: any
	label: string
	onClick?: () => void
}) => {
	const { setAppState } = useAppContext()
	return (
		<Flex
			onClick={() => {
				onClick && onClick()
				setAppState({ show_left_nav: false })
			}}
			alignItems={'center'}
			justifyContent={{
				md: 'center',
				lg: 'flex-start',
			}}
			gap={DEFAULT_PADDING}
			p={DEFAULT_PADDING}
			h={'60px'}
			rounded={'md'}
			color="dark_light"
			_hover={{
				bg: 'dark',
				color: 'white',
				_dark: {
					bg: 'dark_light',
					color: 'white',
				},
			}}
			cursor={'pointer'}
			_dark={{
				color: 'dark_lighter',
			}}
		>
			<Icon size={25} />
			<Text fontSize={'lg'}>{label}</Text>
		</Flex>
	)
}
