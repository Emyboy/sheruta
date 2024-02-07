'use client'
import { NAV_HEIGHT, SIDE_NAV_WIDTH } from '@/configs/theme'
import { Box, Flex, Hide, Link, useColorMode } from '@chakra-ui/react'
import React from 'react'
import MainBodyContent from './MainBodyContent'
import NextLink from 'next/link'
import RightColumnHeader from './RightColumnHeader'
import MainContainer from './MainContainer'

type Props = {
	children: React.ReactNode
	header: React.ReactNode
}

export default function ThreeColumnLayout({ children, header }: Props) {
	const { colorMode } = useColorMode()
	return (
		<>
			<Flex w="full">
				<Hide below="lg">
					<Box
						id="left-nav"
						zIndex={100}
						// minW={SIDE_NAV_WIDTH}
						flex={1}
						borderRight={'1px'}
						borderColor={'border_color'}
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
							<NextLink href="/">
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
							</NextLink>
							{/* @ts-ignore */}
							{children[0]}
						</Flex>
					</Box>
				</Hide>
				<MainBodyContent pt={NAV_HEIGHT} pb={5}>
					<Flex
						zIndex={50}
						justifyContent={'center'}
						h={NAV_HEIGHT}
						position={'fixed'}
						// left={0}
						right={0}
						w={{
							md: `calc(100% - 60px)`,
							lg: 'full',
						}}
						top={0}
					>
						<MainContainer
							display={'flex'}
							justifyContent={'center'}
							bg="white"
							alignItems={'center'}
							borderBottom={'1px'}
							borderColor={'border_color'}
							_dark={{ borderColor: 'dark_light', bg: 'dark' }}
						>
							<MainBodyContent>{header}</MainBodyContent>
						</MainContainer>
					</Flex>
					{
						<>
							{/* @ts-ignore */}
							{children[1]}
							<div id="end"></div>
						</>
					}
				</MainBodyContent>
				<Hide below="lg">
					<Box
						zIndex={100}
						minW={SIDE_NAV_WIDTH}
						flex={1}
						borderLeft={'1px'}
						borderColor={'border_color'}
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
