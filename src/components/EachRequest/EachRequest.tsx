import { DEFAULT_PADDING } from '@/configs/theme'
import {
	Avatar,
	AvatarBadge,
	Badge,
	Box,
	Button,
	Flex,
	Image,
	Text,
} from '@chakra-ui/react'
import React from 'react'
import {
	BiBarChart,
	BiDotsHorizontalRounded,
	BiLocationPlus,
	BiMessageRoundedDetail,
	BiPhone,
} from 'react-icons/bi'
import MainTooltip from '../atoms/MainTooltip'

type Props = {}

export default function EachRequest({}: Props) {
	return (
		<Box
			fontSize={{
				md: 'md',
				base: 'sm'
			}}
			borderBottom={'1px'}
			borderColor={'border_color'}
			py={DEFAULT_PADDING}
			bg="white"
			_dark={{
				bg: 'dark',
				borderColor: 'dark_light',
			}}
			key={Math.random()}
			width={'full'}
		>
			<Flex flexDirection={'column'} gap={DEFAULT_PADDING}>
				<Flex gap={5} alignItems={'center'}>
					<Avatar src="https://bit.ly/prosper-baba" size={{
						md: 'md',
						base: 'md'
					}}>
						<AvatarBadge boxSize="20px" bg="green.500" />
					</Avatar>
					<Flex
						gap={'0px'}
						flexDirection={'column'}
						justifyContent={'flex-start'}
						flex={1}
					>
						<Flex justifyContent={'space-between'} alignItems={'center'}>
							<Text>The first name</Text>
							<Button
								color="text_muted"
								p={0}
								h="10px"
								_hover={{
									color: 'black',
									_dark: {
										color: 'white',
									},
								}}
								bg="none"
								fontSize={{
									md: 'xl',
									base: 'lg'
								}}
							>
								<BiDotsHorizontalRounded />
							</Button>
						</Flex>
						<Text color="text_muted" fontSize={'sm'}>
							4 hours ago
						</Text>
					</Flex>
				</Flex>
				<Flex flexDirection={'column'}>
					<Flex
						alignItems={'center'}
						as="address"
						color="brand"
						fontSize={'sm'}
					>
						<BiLocationPlus /> Somewhere in town
					</Flex>
					<Text>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi,
						distinctio, veritatis ipsa cum perferendis cumque fugit pariatur
						nobis ab deserunt impedit optio, repellat earum similique. Obcaecati
						pariatur exercitationem incidunt perspiciatis!{' '}
						<Text as="span" color="brand">
							Read more..
						</Text>
					</Text>
				</Flex>
				<Flex justifyContent={'space-between'}>
					<Flex gap={DEFAULT_PADDING}>
						<Badge colorScheme="green" rounded="md">
							Join Paddy
						</Badge>
						<Badge colorScheme="orange" rounded="md">
							Available
						</Badge>
					</Flex>
					<Badge
						border="1px"
						borderColor={'border-color'}
						rounded="md"
						_dark={{
							borderColor: 'dark_light',
							color: 'dark_lighter',
						}}
					>
						Private Room
					</Badge>
				</Flex>
				<EachRequestImages />
				<Flex alignItems={'center'} justifyContent={'space-between'}>
					<Flex gap={DEFAULT_PADDING}>
						<MainTooltip label="Call me" placement="top">
							<Button
								px={0}
								bg="none"
								color="text_muted"
								display={'flex'}
								gap={1}
								fontWeight={'light'}
								_hover={{
									color: 'brand',
									bg: 'none',
									_dark: {
										color: 'brand',
									},
								}}
								_dark={{
									color: 'dark_lighter',
								}}
								fontSize={{
									md: 'xl',
									base: 'lg'
								}}
							>
								<BiPhone /> 35
							</Button>
						</MainTooltip>
						<MainTooltip label="Ask questions" placement="top">
							<Button
								px={0}
								bg="none"
								color="text_muted"
								display={'flex'}
								gap={1}
								fontWeight={'light'}
								_hover={{
									color: 'brand',
									bg: 'none',
									_dark: {
										color: 'brand',
									},
								}}
								_dark={{
									color: 'dark_lighter',
								}}
								fontSize={{
									md: 'xl',
									base: 'lg'
								}}
							>
								<BiMessageRoundedDetail /> 35
							</Button>
						</MainTooltip>
						<MainTooltip label="Engagements" placement="top">
							<Button
								px={0}
								bg="none"
								color="text_muted"
								display={'flex'}
								gap={1}
								fontWeight={'light'}
								_hover={{
									color: 'brand',
									bg: 'none',
									_dark: {
										color: 'brand',
									},
								}}
								_dark={{
									color: 'dark_lighter',
								}}
								fontSize={{
									md: 'xl',
									base: 'lg'
								}}
							>
								<BiBarChart /> 135
							</Button>
						</MainTooltip>
					</Flex>
					<Flex
						_dark={{
							color: 'dark_lighter',
						}}
						alignItems={'center'}
					>
						<Text fontSize={'lg'} fontWeight={'bold'}>
							₦500,000
						</Text>{' '}
						<Text>/month</Text>
					</Flex>
				</Flex>
			</Flex>
		</Box>
	)
}

const EachRequestImages = () => {
	return (
		<Flex
			h={{
				md: '300px',
				base: '200px',
			}}
			gap={DEFAULT_PADDING}
		>
			<Box position={'relative'} overflow={'hidden'} rounded="md" w={'50%'}>
				<Image
					src={'/samples/2.png'}
					alt="shared space"
					position={'relative'}
					w="full"
				/>
			</Box>
			<Flex flexDirection={'column'} gap={DEFAULT_PADDING} w={'50%'} flex={1}>
				<Box position={'relative'} overflow={'hidden'} rounded="md" bg="dark">
					<Image
						src={'/samples/4.png'}
						alt="shared space"
						position={'relative'}
					/>
				</Box>
				<Box position={'relative'} overflow={'hidden'} rounded="md" bg="dark">
					<Image
						src={'/samples/9.png'}
						alt="shared space"
						position={'relative'}
					/>
				</Box>
			</Flex>
		</Flex>
	)
}
