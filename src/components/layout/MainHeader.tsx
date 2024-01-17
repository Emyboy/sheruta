'use client'
import {
	Box,
	Button,
	Flex,
	Image,
	Tooltip,
	useColorMode,
} from '@chakra-ui/react'
import React from 'react'
import MainContainer from './MainContainer'
import { BODY_WIDTH, DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'
import { BiBell, BiHome, BiPlus, BiSearchAlt, BiSun } from 'react-icons/bi'
import Link from 'next/link'
import MainTooltip from '../atoms/MainTooltip'

type Props = {}

export default function MainHeader({}: Props) {
	const { colorMode, toggleColorMode } = useColorMode()
	return (
		<Flex
			justifyContent={'center'}
			h={NAV_HEIGHT}
			position={'fixed'}
			// left={0}
			right={0}
			w={{
				md: `calc(100% - 60px)`,
			}}
			top={0}
			zIndex={90}
		>
			<MainContainer>
				<Flex
					justifyContent={'center'}
					h="full"
					borderBottom={'1px'}
					borderColor={'border_color'}
					bg="white"
					_dark={{
						bg: 'dark',
						borderColor: 'dark_light',
					}}
				>
					<Flex
						w={BODY_WIDTH}
						justifyContent={'space-between'}
						alignItems={'center'}
						h="full"
						px={DEFAULT_PADDING}
					>
						<EachNav label="Home" Icon={BiHome} active />
						<EachNav label="Post Request" Icon={BiPlus} />
						<EachNav label="Notifications" Icon={BiBell} />
						<EachNav label="Search" Icon={BiSearchAlt} />
						{process.env.NODE_ENV !== 'production' && (
							<EachNav
								label="Change Mode"
								Icon={BiSun}
								onClick={toggleColorMode}
							/>
						)}
					</Flex>
				</Flex>
			</MainContainer>
		</Flex>
	)
	return (
		<Flex
			justifyContent={'center'}
			as="nav"
			bg="dark"
			color="white"
			position={'fixed'}
			top={0}
			left={0}
			right={0}
			height={NAV_HEIGHT}
			maxH={NAV_HEIGHT}
			zIndex={100}
		>
			<MainContainer>
				<Flex
					justifyContent={'space-between'}
					h={'100%'}
					w={'100%'}
					alignItems={'center'}
				>
					<Link href={`/`}>
						<Flex gap={4} alignItems={'center'}>
							<img src="/icon_green.png" alt="sheruta ng" width={30} />
							<img src="/logo_text_white.png" alt="sheruta ng" width={130} />
						</Flex>
					</Link>
					<Flex flex={1} justifyContent={'center'} gap={5}>
						<EachNav label="Home" Icon={BiHome} active />
						<EachNav label="Post Request" Icon={BiPlus} />
						<EachNav label="Search" Icon={BiSearchAlt} />
						<EachNav label="Notifications" Icon={BiBell} />
					</Flex>
					<Flex>
						<Button
							border={'1px'}
							color={'white'}
							borderColor={'brand_dark'}
							_hover={{
								bg: 'brand_darker',
								color: 'accent',
							}}
						>
							Login
						</Button>
					</Flex>
				</Flex>
			</MainContainer>
		</Flex>
	)
}

const EachNav = ({
	Icon,
	active,
	label,
	onClick,
}: {
	Icon: any
	active?: boolean
	label: string
	onClick?: () => void
}) => {
	return (
		<MainTooltip label={label}>
			<Button
				onClick={onClick ? onClick : () => {}}
				p="0px"
				h="45px"
				w="45px"
				border="1px"
				borderColor={'border_color'}
				color={active ? 'white' : 'text_muted'}
				bg={active ? 'dark' : 'white'}
				_dark={{
					bg: active ? 'brand_darker' : 'dark',
					borderColor: active ? 'brand' : 'dark_light',
					color: active ? 'brand' : 'dark_lighter',
				}}
				_hover={{
					// bg: 'dark',
					color: 'dark',
					borderColor: 'dark',
					_dark: {
						color: 'brand',
						borderColor: 'brand',
					},
				}}
			>
				<Icon size={25} />
			</Button>
		</MainTooltip>
	)
}
