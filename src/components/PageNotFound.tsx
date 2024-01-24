import { NAV_HEIGHT } from '@/configs/theme'
import { Flex, Text } from '@chakra-ui/react'
import React from 'react'

export default function PageNotFound() {
	return (
		<Flex
			minH={`calc(90vh - ${NAV_HEIGHT})`}
			flexDirection={'column'}
			justifyContent={'center'}
			alignItems={'center'}
		>
			<Text fontSize={'100px'}>404</Text>
			<Text>Page Not Found</Text>
		</Flex>
	)
}
