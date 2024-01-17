import { BODY_WIDTH, NAV_HEIGHT, SIDE_NAV_WIDTH } from '@/configs/theme'
import { Box, Flex, Link } from '@chakra-ui/react'
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
					<Flex
						flexDirection={'column'}
						minH={`calc(100vh)`}
						position={'sticky'}
						top={0}
						alignItems={'flex-start'}
						w="full"
					>
						<Link href="/">
							<Flex
								gap={4}
								alignItems={'center'}
								h={NAV_HEIGHT}
								maxH={NAV_HEIGHT}
							>
								<img src="/icon_green.png" alt="sheruta ng" width={30} />
								<img src="/logo_text_white.png" alt="sheruta ng" width={130} />
							</Flex>
						</Link>
						{/* @ts-ignore */}
						{children[0]}
					</Flex>
				</Box>
				<Box pt={NAV_HEIGHT} pb={5} maxW={BODY_WIDTH}>
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
					<Box minH={`calc(100vh)`} position={'sticky'} top={0}>
						<Flex
							gap={4}
							alignItems={'center'}
							h={NAV_HEIGHT}
							maxH={NAV_HEIGHT}
							justifyContent={'flex-end'}
						>
							<Link
								rounded={'md'}
								href="/"
								px="30px"
								py="10px"
								border={'1px'}
								color={'dark_light'}
								borderColor={'dark_lighter'}
								bg="white"
								_dark={{
									bg: 'dark',
									color: 'dark_lighter',
								}}
								_hover={{
									color: 'dark',
									borderColor: 'dark',
									_dark: {
										color: 'dark_lighter',
										borderColor: 'dark_lighter',
									},
								}}
							>
								Upload
							</Link>
							<Link
								rounded={'md'}
								href="/"
								px="30px"
								py="10px"
								border={'1px'}
								color={'white'}
								borderColor={'dark_lighter'}
								bg="dark"
								_hover={{
									bg: 'brand_darker',
									color: 'accent',
								}}
								_dark={{
									borderColor: 'brand',
									color: 'brand',
								}}
							>
								Login
							</Link>
						</Flex>
						{/* @ts-ignore */}
						{children[2]}
					</Box>
				</Box>
			</Flex>
		</>
	)
}
