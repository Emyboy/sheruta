'use client'
import { Flex, useColorMode } from '@chakra-ui/react'
import React from 'react'
import {
	BiBell,
	BiHome,
	BiPlus,
	BiSearchAlt,
	BiSun,
	BiUserPlus,
} from 'react-icons/bi'
import MainBodyContent from './MainBodyContent'
import MainIconBtn from '../atoms/MainIconBtn'
import { DEFAULT_PADDING } from '@/configs/theme'

type Props = {}

export default function MainHeader({}: Props) {
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
				<MainIconBtn label="Home" Icon={BiHome} active />
				<MainIconBtn label="Post Request" Icon={BiPlus} />
				<MainIconBtn label="Notifications" Icon={BiBell} />
				<MainIconBtn label="Matches" Icon={BiUserPlus} />
				<MainIconBtn label="Search" Icon={BiSearchAlt} />
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
