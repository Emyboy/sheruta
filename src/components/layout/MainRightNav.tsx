import { DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'
import { Avatar, Divider, Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'

type Props = {}

export default function MainRightNav({}: Props) {
	return (
		<Flex
			minH={`calc(100vh - ${NAV_HEIGHT})`}
			flexDirection={'column'}
			pl={DEFAULT_PADDING}
			w="full"
			py={DEFAULT_PADDING}
		>
			<Flex
				p={DEFAULT_PADDING}
				bg="white"
				border={'1px'}
				borderColor={'border_color'}
				_dark={{
					bg: 'dark',
					borderColor: 'dark_light',
				}}
				rounded={'xl'}
				flexDirection={'column'}
				gap={DEFAULT_PADDING}
				w="full"
			>
				<Flex gap={2} flexDirection={'column'}>
					<Text fontSize={'lg'} color="dark_lighter">
						Trending Locations
					</Text>
					<Divider bg="dark_light" />
				</Flex>
				<Flex flexDirection={'column'}>
					<EachLocation />
					<EachLocation />
					<EachLocation />
					<EachLocation />
					<EachLocation />
					<EachLocation />
				</Flex>
			</Flex>
		</Flex>
	)
}

const EachLocation = () => {
	return (
		<Flex alignItems={'center'} gap={DEFAULT_PADDING} py={2} cursor={'pointer'}>
			<Image src="/samples/2.png" alt="location" width={35} rounded={'md'} />
			<Flex flexDirection={'column'} maxW={'80%'}>
				<Text>The location name</Text>
				<Text isTruncated fontSize={'sm'} color="text_muted">
					Some shit about the location goes over here
				</Text>
			</Flex>
		</Flex>
	)
}
