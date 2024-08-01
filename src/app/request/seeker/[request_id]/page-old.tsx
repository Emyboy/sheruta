'use client'

import MainContainer from '@/components/layout/MainContainer'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import {
	Box,
	Flex,
	Alert,
	AlertIcon,
	Text,
	Button,
	IconButton,
	Input,
	Avatar,
} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import React from 'react'
import MainLeftNav from '@/components/layout/MainLeftNav'
import { DEFAULT_PADDING } from '@/configs/theme'
import MainHeader from '@/components/layout/MainHeader'
import CreateSeekerForm from '@/components/forms/CreateSeekerForm'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { BiLeftArrow } from 'react-icons/bi'
import { FaAngleLeft } from 'react-icons/fa'

import { BiLocationPlus } from 'react-icons/bi'
import { TbSend } from 'react-icons/tb'

type Props = {}
export default function page() {
	let size = {
		base: '98vw',
		lg: '1000px',
	}
	return (
		<>
			<Flex justifyContent={'center'} alignItems={'center'} minH={'100vh'}>
				<Flex
					border={'1px'}
					minH={'90vh'}
					maxH={'90vh'}
					maxW={size}
					minW={size}
					rounded={'lg'}
					borderColor={'brand_darker'}
					overflow={'hidden'}
				>
					<Flex
						minW={'50%'}
						maxW={'50%'}
						borderRight={'1px'}
						borderColor={'brand_darker'}
						flexFlow={'column'}
					>
						<Flex p={DEFAULT_PADDING} gap={DEFAULT_PADDING}>
							<Avatar src="https://bit.ly/prosper-baba" />
							<Flex flexFlow={'column'}>
								<Text>Person first name</Text>
								<Text fontSize={'sm'} color={'text_muted'}>
									Person first name
								</Text>
							</Flex>
						</Flex>
						<Flex flexFlow={'column'} p={DEFAULT_PADDING}>
							<Flex
								alignItems={'center'}
								as="address"
								color="brand"
								fontSize={'sm'}
							>
								<BiLocationPlus /> Somewhere in town
							</Flex>
							<Text>
								Lorem ipsum dolor sit amet consectetur adipisicing elit.
								Excepturi, distinctio, veritatis ipsa cum perferendis cumque
								fugit pariatur nobis ab deserunt impedit optio, repellat earum
								similique. Obcaecati pariatur exercitationem incidunt
								perspiciatis!{' '}
							</Text>
						</Flex>
					</Flex>

					<Flex flex={1} flexFlow={'column'}>
						<Flex
							minH={'70px'}
							maxH={'70px'}
							borderBottom={'1px'}
							borderColor={'brand_darker'}
						></Flex>
						<Flex
							flex={1}
							flexFlow={'column'}
							overflowY={'auto'}
							overflowX={'hidden'}
							p={DEFAULT_PADDING}
						>
							{new Array(89).fill(null).map((_, i) => {
								return (
									<Text key={i}>
										Lorem ipsum, dolor sit amet consectetur adipisicing elit.
										Ullam, asperiores! Neque cumque alias cupiditate
									</Text>
								)
							})}
						</Flex>
						<Flex
							as="form"
							minH={'70px'}
							maxH={'70px'}
							borderTop={'1px'}
							borderColor={'brand_darker'}
							alignItems={'center'}
							gap={DEFAULT_PADDING}
							px={DEFAULT_PADDING}
						>
							<Input placeholder="Enter message..." outline={'none'} />
							<Button bg="none" color={'text_muted'}>
								<TbSend size={20} />
							</Button>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		</>
	)
}

// export default function Page({}: Props) {
// 	const router = useRouter()

// 	const handleBackClick = () => {
// 		router.back()
// 	}

// 	return (
// 		<Flex justifyContent={'center'}>
// 			<MainContainer>
// 				<ThreeColumnLayout header={<MainHeader />}>
// 					<Flex flexDirection={'column'} w="full">
// 						<MainLeftNav />
// 					</Flex>
// 					<Box p={DEFAULT_PADDING}>
// 						<Box marginBottom={10}>
// 							<Box marginBottom={10}>
// 								<Flex align="center" mb={4}>
// 									<IconButton
// 										onClick={handleBackClick}
// 										aria-label="Search database"
// 										icon={<FaAngleLeft />}
// 										variant="ghost"
// 										_hover={{ bg: 'transparent' }}
// 										_focus={{ boxShadow: 'none' }}
// 										_active={{ bg: 'transparent' }}
// 									/>

// 									<Text fontSize="3xl" fontWeight="bold">
// 										Post Your Flat Request
// 									</Text>
// 								</Flex>
// 								<Text marginBottom={3} color="gray">
// 									Looking for flat? Post your request and have like minded
// 									people reach out to you.
// 								</Text>
// 								<Alert status="info">
// 									<Flex direction="row" alignItems="center">
// 										<AlertIcon />
// 										<span>
// 											{
// 												'Have a vacant space? Increase occupancy rate by posting visuals. '
// 											}
// 											<NextLink href={'/request/host'}>
// 												<Text as="u">Click here</Text>
// 											</NextLink>
// 											{' to post with visuals.'}
// 										</span>
// 									</Flex>
// 								</Alert>
// 							</Box>
// 						</Box>
// 						<Box maxWidth="600px" mx="auto">
// 							<CreateSeekerForm />
// 						</Box>
// 					</Box>
// 				</ThreeColumnLayout>
// 			</MainContainer>
// 		</Flex>
// 	)
// }
