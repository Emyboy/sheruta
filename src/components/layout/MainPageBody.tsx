import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import MainContainer from './MainContainer'
import { NAV_HEIGHT } from '@/configs/theme'

type Props = {}

export default function MainPageBody({ children }: any) {
	return (
		<Flex justifyContent={'center'}>
			<MainContainer>
				<Box minH={'calc(100vh)'}>{children}</Box>
			</MainContainer>
		</Flex>
	)
}
