'use client'
import { DEFAULT_PADDING } from '@/configs/theme'
import { useNotificationContext } from '@/context/notifications.context'
import { Flex, Hide, useColorMode } from '@chakra-ui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
	BiBell,
	BiHome,
	BiMessageRoundedDetail,
	BiPlus,
	BiSearchAlt,
	BiSun,
} from 'react-icons/bi'
import MainIconBtn from '../atoms/MainIconBtn'
import MainBodyContent from './MainBodyContent'
import MobileHeader from './MobileHeader'

type Props = {}

export default function MainHeader({}: Props) {
	const pathname = usePathname()
	const { toggleColorMode } = useColorMode()
	const { unreadNotifications } = useNotificationContext()

	return (
		<>
			<MobileHeader />
			<Hide below="lg">
				<Flex
					justifyContent={'center'}
					h="full"
					bg="white"
					zIndex={600}
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
							<MainIconBtn
								label="Home"
								Icon={BiHome}
								active={pathname === '/'}
							/>
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
								hasNotification={unreadNotifications}
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
			</Hide>
		</>
	)
}
