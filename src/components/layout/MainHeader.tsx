'use client'
import { Flex, useColorMode } from '@chakra-ui/react'
import React from 'react'
import {
	BiBell,
	BiHome,
	BiMessageRoundedDetail,
	BiPlus,
	BiSearchAlt,
	BiSun,
} from 'react-icons/bi'
import MainBodyContent from './MainBodyContent'
import MainIconBtn from '../atoms/MainIconBtn'
import { DEFAULT_PADDING } from '@/configs/theme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {}

export default function MainHeader({}: Props) {
	const pathname = usePathname()
	const { toggleColorMode } = useColorMode()

	return (
		<Flex
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
				<Link href={`/`}>
					<MainIconBtn label="Home" Icon={BiHome} active={pathname === '/'} />
				</Link>
				<Link href={`/request`}>
					<MainIconBtn
						label="Post Request"
						Icon={BiPlus}
						active={pathname.includes('request')}
					/>
				</Link>
				<Link href={`/notifications`}>
					<MainIconBtn
						label="Notifications"
						Icon={BiBell}
						active={pathname === '/notifications'}
					/>
				</Link>
				<Link href={`/messages`}>
					<MainIconBtn
						label="Messages"
						Icon={BiMessageRoundedDetail}
						active={pathname.includes('messages')}
					/>
				</Link>
				<Link href={`/search`}>
					<MainIconBtn
						label="Search"
						Icon={BiSearchAlt}
						active={pathname.includes('search')}
					/>
				</Link>
				{process.env.NODE_ENV !== 'production' && (
					<MainIconBtn
						label="Change Mode"
						Icon={BiSun}
						onClick={toggleColorMode}
					/>
				)}
			</MainBodyContent>
		</Flex>
	)
}
