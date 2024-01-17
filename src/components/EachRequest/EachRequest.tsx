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
import { BiDotsHorizontalRounded, BiLocationPlus } from 'react-icons/bi'

type Props = {}

export default function EachRequest({ }: Props) {
	return (
		<Box
			borderBottom={'1px'}
			borderColor={'border_color'}
			p={DEFAULT_PADDING}
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
					<Avatar src="https://bit.ly/prosper-baba">
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
							>
								<BiDotsHorizontalRounded size={25} />
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
			</Flex>
		</Box>
	)
}

const EachRequestImages = () => {
	return (
		<Flex h="300px" gap={DEFAULT_PADDING}>
			<Box position={'relative'} overflow={'hidden'} rounded='md'>
				<Image
					src={'/samples/2.png'}
					alt="shared space"
					position={'relative'}
				/>
			</Box>
			<Flex flexDirection={'column'} gap={DEFAULT_PADDING} w='150px' flex={1}>
				<Box position={'relative'} overflow={'hidden'} rounded='md' bg="dark">
					<Image
						src={'/samples/4.png'}
						alt="shared space"
						position={'relative'}
					/>
				</Box>
				<Box position={'relative'} overflow={'hidden'} rounded='md' bg="dark">
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
