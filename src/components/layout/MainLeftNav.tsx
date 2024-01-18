'use client'
import { DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
import { Box, Divider, Flex, Hide, Text, Icon } from '@chakra-ui/react'
import React from 'react'
import {
	BiCalendarAlt,
	BiLogInCircle,
	BiRocket,
	BiWallet,
	BiWrench,
} from 'react-icons/bi'

type Props = {}

export default function MainLeftNav({}: Props) {
	const { logout } = useAuthContext()
	return (
		<Flex
			flexDirection={'column'}
			w={{
				lg: `calc(100% - ${DEFAULT_PADDING})`,
				md: '60px',
			}}
			minH={`calc(100vh - ${NAV_HEIGHT})`}
			gap={`calc(${DEFAULT_PADDING})`}
			py={DEFAULT_PADDING}
			alignItems={{
				lg: 'flex-start',
				bse: 'center',
			}}
		>
			<EachNav Icon={BiRocket} label="Get Started" />
			<EachNav Icon={BiCalendarAlt} label="Inspections" />
			<EachNav Icon={BiWallet} label="Wallet" />
			<EachNav Icon={BiWrench} label="Settings" />
			<Divider
				color="border_color"
				_dark={{
					bg: 'dark_light',
				}}
			/>
			<EachNav Icon={BiLogInCircle} label="Logout" onClick={logout} />
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
	return (
		<Flex
			onClick={onClick}
			alignItems={'center'}
			justifyContent={{
				md: 'center',
				lg: 'flex-start',
			}}
			gap={DEFAULT_PADDING}
			p={{
				lg: DEFAULT_PADDING,
				md: `calc(${DEFAULT_PADDING} - 10px)`,
			}}
			h={{
				md: '60px',
				lg: 'auto',
			}}
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
			<Hide below="lg">
				<Text fontSize={'lg'}>{label}</Text>
			</Hide>
		</Flex>
	)
}
