'use client'

import { DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'
import { useNotificationContext } from '@/context/notifications.context'
import { Flex, Hide } from '@chakra-ui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
	BiBell,
	BiHome,
	BiMessageRoundedDetail,
	BiPlus,
	BiSearchAlt,
} from 'react-icons/bi'
import MainIconBtn from '../atoms/MainIconBtn'

type Props = {}

export default function MobileNavFooter({}: Props) {
	const pathname = usePathname()
	const { unreadNotifications } = useNotificationContext()

	return (
		<Hide above="lg">
			<Flex
				position={'fixed'}
				bottom={0}
				bg="white"
				left={0}
				right={0}
				_dark={{
					bg: 'dark',
					borderColor: 'dark_light',
				}}
				h={NAV_HEIGHT}
				justifyContent={'space-between'}
				alignItems={'center'}
				px={DEFAULT_PADDING}
				borderTop={'1px'}
				borderColor={'border_color'}
			>
				<Link href={`/`}>
					<MainIconBtn label="Home" Icon={BiHome} active={pathname === '/'} />
				</Link>
				<Link href={`/notifications`}>
					<MainIconBtn
						label="Notifications"
						Icon={BiBell}
						active={pathname === '/notifications'}
						hasNotification={unreadNotifications}
					/>
				</Link>
				<Link href={`/request`}>
					<MainIconBtn
						label="Post Request"
						Icon={BiPlus}
						active={pathname.includes('request')}
					/>
				</Link>
				<Link href={`/messages`}>
					<MainIconBtn
						label="Messages"
						Icon={BiMessageRoundedDetail}
						active={pathname.includes('messages')}
						hasNotification
					/>
				</Link>
				<Link href={`/search`}>
					<MainIconBtn
						label="Search"
						Icon={BiSearchAlt}
						active={pathname.includes('search')}
					/>
				</Link>
			</Flex>
		</Hide>
	)
}
