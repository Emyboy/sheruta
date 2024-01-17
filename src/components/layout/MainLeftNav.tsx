import { DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'
import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { BiRocket } from 'react-icons/bi'

type Props = {}

export default function MainLeftNav({ }: Props) {
	return (
		<Flex flexDirection={'column'} w="full" minH={`calc(100vh - ${NAV_HEIGHT})`} gap={`calc(${DEFAULT_PADDING})`}>
			<EachNav />
			<EachNav />
			<EachNav />
			<EachNav />
			<EachNav />
		</Flex>
	)
}

const EachNav = () => {
	return <Flex alignItems={'center'} gap={DEFAULT_PADDING} bg='dark_light' w='full'>
		<BiRocket size={25} />
		<Text>Home</Text>
	</Flex>
}
