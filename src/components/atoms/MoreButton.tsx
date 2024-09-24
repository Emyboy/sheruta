"use client"

import {
	Popover,
	PopoverTrigger,
	Flex,
	Button,
	PopoverContent,
	PopoverBody,
	VStack,
	Text,
} from '@chakra-ui/react'

import {
	BiDotsHorizontalRounded,
	BiShare,
	BiPencil,
	BiTrash,
} from 'react-icons/bi'
import { DEFAULT_PADDING } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
import { useEffect, useState } from 'react'

interface Props {
	userId: any
	moreButtonList: object[]
}

export function MoreButton({ userId, moreButtonList }: Props) {

	const [profileOwner, setProfileOwner] = useState(false);

	const { authState } = useAuthContext();
	
	useEffect(()=>{
		
		const {user} = authState;
		const currentUser = user?._id
    const viewedProfileId = userId;

	if(viewedProfileId === currentUser){
		setProfileOwner(true)
	}
	},[userId, authState ])

	


	return (
		<Flex mr="10px">
			<Popover>
				<PopoverTrigger>
					<Button
						w="45px"
						height="45px"
						border={''}
						rounded={'md'}
						borderColor="dark_light"
						px={0}
						bg="none"
						color="text_muted"
						display={'flex'}
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
							base: 'lg',
						}}
					>
						<BiDotsHorizontalRounded />
					</Button>
				</PopoverTrigger>
				<PopoverContent color={'dark'} bg={'dark'} width={'100%'} padding={4}>
					<PopoverBody p={0} zIndex={1000}>
						<VStack spacing={1} align="flex-start">
						{!profileOwner && (<Button
								variant="ghost"
								leftIcon={<BiShare />}
								bgColor="none"
								width="100%"
								display="flex"
								alignItems="center"
								padding={0}
								borderRadius="sm"
								_hover={{ color: 'brand_dark' }}
							>
								<Text width={'100%'} textAlign={'left'}>
									Share
								</Text>
							</Button>)}
							{profileOwner && (
								<>
									<Button
										variant="ghost"
										leftIcon={<BiPencil />}
										bgColor="none"
										width="100%"
										display="flex"
										alignItems="center"
										padding={0}
										borderRadius="sm"
										_hover={{ color: 'brand_dark' }}
									>
										<Text width={'100%'} textAlign={'left'}>
											Edit
										</Text>
									</Button>
									<Button
										variant="ghost"
										leftIcon={<BiTrash />}
										bgColor="none"
										width="100%"
										display="flex"
										alignItems="center"
										padding={0}
										borderRadius="sm"
										_hover={{ color: 'red.500' }}
										color="red.400"
									>
										<Text width={'100%'} textAlign={'left'}>
											Delete
										</Text>
									</Button>
								</>
							)}
						</VStack>
					</PopoverBody>
				</PopoverContent>
			</Popover>
		</Flex>
	)
}
