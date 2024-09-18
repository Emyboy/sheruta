'use client'

import { DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'
import { useAppContext } from '@/context/app.context'
import { useAuthContext } from '@/context/auth.context'
import { Divider, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
	BiBookmark,
	BiCalendarAlt,
	BiCheckShield,
	BiLogInCircle,
	BiMessageSquareDetail,
	BiWallet,
	BiWrench,
} from 'react-icons/bi'

type Props = {}

export default function MainLeftNav({ }: Props) {
	const {
		logout,
		authState: { user_info },
	} = useAuthContext()
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
			<Link href={'/inspections'}>
				<EachNav Icon={BiCalendarAlt} label="Inspections" />
			</Link>
			<EachNav Icon={BiWallet} label="Wallet" />
			<Link href={'/settings'}>
				<EachNav Icon={BiWrench} label="Settings" />
			</Link>

			{user_info && !user_info?.is_verified ? (
				<Link href="/verification">
					<EachNav Icon={BiCheckShield} label="Verification" />
				</Link>
			) : null}
			<Link href="/bookmarks">
				<EachNav Icon={BiBookmark} label="Bookmarks" />
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
	const pathname = usePathname()

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
			_light={{
				bg: pathname.startsWith(`/${label.toLocaleLowerCase()}`) && 'dark',
				color: pathname.startsWith(`/${label.toLocaleLowerCase()}`) && 'white',
			}}
			cursor={'pointer'}
			_dark={{
				color: pathname.startsWith(`/${label.toLocaleLowerCase()}`)
					? 'white'
					: 'dark_lighter',
				bg: pathname.startsWith(`/${label.toLocaleLowerCase()}`)
					? 'dark_light'
					: 'none',
			}}
		>
			<Icon size={25} />
			<Text fontSize={'lg'}>{label}</Text>
		</Flex>
	)
}
