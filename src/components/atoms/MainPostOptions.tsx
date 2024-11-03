import { DEFAULT_PADDING } from '@/configs/theme'
import { Flex, Text, Box } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { BiSolidMegaphone } from 'react-icons/bi'
import { RiVideoUploadLine } from 'react-icons/ri'
import { PiUploadSimpleBold } from 'react-icons/pi'

import MainBackHeader from './MainBackHeader'

type Props = {}

export default function MainPostOptions({}: Props) {
	return (
		<Box>
			<Flex mb={5}>
				<MainBackHeader px={0} />
			</Flex>
			<Flex gap={DEFAULT_PADDING}>
				<Link href={`/request/host`} style={{ width: '50%' }}>
					<EachOption Icon={RiVideoUploadLine} label="Post vacant space" />
				</Link>
				<Link href={`/request/seeker`} style={{ width: '50%' }}>
					<EachOption Icon={PiUploadSimpleBold} label="Request a space" />
				</Link>
			</Flex>
		</Box>
	)
}

const EachOption = ({ label, Icon }: { label: string; Icon: any }) => {
	return (
		<Flex
			flexDir={'column'}
			alignItems={'center'}
			// w={'50%'}
			border={'1px'}
			_dark={{
				borderColor: 'dark_light',
				color: 'dark_lighter',
			}}
			_hover={{
				_dark: {
					color: '#00bc73',
					borderColor: '#00bc73',
				},
			}}
			rounded={'md'}
			h="200px"
			gap={DEFAULT_PADDING}
			justifyContent={'center'}
		>
			<Icon size={30} />
			<Text fontSize={{ base: 'base', md: 'lg', xl: 'xl' }}>{label}</Text>
		</Flex>
	)
}
