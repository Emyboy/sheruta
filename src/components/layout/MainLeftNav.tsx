import { DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'
import { Box, Divider, Flex, Text } from '@chakra-ui/react'
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
	return (
		<Flex
			flexDirection={'column'}
			w={`calc(100% - ${DEFAULT_PADDING})`}
			minH={`calc(100vh - ${NAV_HEIGHT})`}
			gap={`calc(${DEFAULT_PADDING})`}
			py={DEFAULT_PADDING}
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
			<EachNav Icon={BiLogInCircle} label="Logout" />
		</Flex>
	)
}

const EachNav = ({ Icon, label }: { Icon: any; label: string }) => {
	return (
		<Flex
			alignItems={'center'}
			gap={DEFAULT_PADDING}
			p={DEFAULT_PADDING}
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
