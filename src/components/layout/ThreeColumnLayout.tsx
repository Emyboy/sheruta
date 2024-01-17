import { NAV_HEIGHT, SIDE_NAV_WIDTH } from '@/configs/theme'
import { Box, Flex } from '@chakra-ui/react'
import React from 'react'

type Props = {
	children: React.ReactNode
}

export default function ThreeColumnLayout({ children }: Props) {
	return (
		<>
			<Flex w="full" gap={5}>
				<Box minW={SIDE_NAV_WIDTH}>
					<Box pt={NAV_HEIGHT} minH={`calc(100vh)`} position={'sticky'} top={0}>
						{/* @ts-ignore */}
						{children[0]}
					</Box>
				</Box>
				<Box flex={1} pt={NAV_HEIGHT}>
					{/* @ts-ignore */}
					{children[1]}
				</Box>
				<Box minW={SIDE_NAV_WIDTH}>
					<Box pt={NAV_HEIGHT} minH={`calc(100vh)`} position={'sticky'} top={0}>
						{/* @ts-ignore */}
						{children[2]}
					</Box>
				</Box>
			</Flex>
		</>
	)
}
