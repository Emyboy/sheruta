import { DEFAULT_PADDING } from '@/configs/theme'
import { Avatar, AvatarBadge, Box, Button, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { BiDotsHorizontalRounded } from 'react-icons/bi'

type Props = {}

export default function EachRequest({}: Props) {
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
		</Box>
	)
}
