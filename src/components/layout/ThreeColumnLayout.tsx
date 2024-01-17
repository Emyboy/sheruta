import { BODY_WIDTH, NAV_HEIGHT, SIDE_NAV_WIDTH } from '@/configs/theme'
import { Box, Flex } from '@chakra-ui/react'
import React from 'react'

type Props = {
	children: React.ReactNode
}

export default function ThreeColumnLayout({ children }: Props) {
	return (
		<>
			<Flex w="full">
				<Box
					// minW={SIDE_NAV_WIDTH}
					flex={1}
					borderRight={'1px'}
					borderColor={'border_color'}
					zIndex={100}
					bg="white"
					_dark={{
						bg: 'dark',
						borderColor: 'dark_light',
					}}
				>
					<Box pt={NAV_HEIGHT} minH={`calc(100vh)`} position={'sticky'} top={0}>
						{/* @ts-ignore */}
						{children[0]}
					</Box>
				</Box>
				<Box pt={NAV_HEIGHT} pb={5} minW={BODY_WIDTH}>
					{/* @ts-ignore */}
					{children[1]}
				</Box>
				<Box
					// minW={SIDE_NAV_WIDTH}
					flex={1}
					borderLeft={'1px'}
					borderColor={'border_color'}
					zIndex={100}
					bg="white"
					_dark={{
						bg: 'dark',
						borderColor: 'dark_light',
					}}
				>
					<Box pt={NAV_HEIGHT} minH={`calc(100vh)`} position={'sticky'} top={0}>
						{/* @ts-ignore */}
						{children[2]}
					</Box>
				</Box>
			</Flex>
		</>
	)
}
