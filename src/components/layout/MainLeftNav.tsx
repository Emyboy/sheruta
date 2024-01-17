import { NAV_HEIGHT } from '@/configs/theme'
import { Box } from '@chakra-ui/react'
import React from 'react'

type Props = {}

export default function MainLeftNav({}: Props) {
	return (
		<Box bg="white" w="full" minH={`calc(100vh - ${NAV_HEIGHT})`} mx={5}>
			How va
		</Box>
	)
}
