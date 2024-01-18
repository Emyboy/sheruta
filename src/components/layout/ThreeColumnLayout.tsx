'use client'
import { NAV_HEIGHT, SIDE_NAV_WIDTH } from '@/configs/theme'
import { Box, Button, Flex, Hide, Link, useColorMode } from '@chakra-ui/react'
import React from 'react'
import MainBodyContent from './MainBodyContent'

import AuthPopup from '../popups/AuthPopup'
import RightColumnHeader from './RightColumnHeader'

type Props = {
	children: React.ReactNode
}

export default function ThreeColumnLayout({ children }: Props) {
	const { colorMode } = useColorMode()
	return (
		<>
			<Flex w="full">
				<Hide below="lg">
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
						<Flex
							flexDirection={'column'}
							minH={`calc(100vh)`}
							position={'sticky'}
							top={0}
							alignItems={{
								lg: 'flex-start',
								md: 'center',
							}}
							w={{
								xl: 'full',
								lg: 'full',
							}}
						>
							<Link href="/">
								<Flex
									gap={4}
									alignItems={'center'}
									h={NAV_HEIGHT}
									maxH={NAV_HEIGHT}
								>
									<img src="/icon_green.png" alt="sheruta ng" width={30} />
									<Hide below="lg">
										{colorMode === 'dark' ? (
											<img
												src="/logo_text_white.png"
												alt="sheruta ng"
												width={130}
											/>
										) : (
											<img
												src="/logo_text_black.png"
												alt="sheruta ng"
												width={130}
											/>
										)}
									</Hide>
								</Flex>
							</Link>
							{/* @ts-ignore */}
							{children[0]}
						</Flex>
					</Box>
				</Hide>
				<MainBodyContent pt={NAV_HEIGHT} pb={5}>
					{/* @ts-ignore */}
					{children[1]}
				</MainBodyContent>
				<Hide below="lg">
					<Box
						minW={SIDE_NAV_WIDTH}
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
						<Box minH={`calc(100vh)`} position={'sticky'} top={0}>
							<RightColumnHeader />

							{/* @ts-ignore */}
							{children[2]}
						</Box>
					</Box>
				</Hide>
			</Flex>
		</>
	)
}
