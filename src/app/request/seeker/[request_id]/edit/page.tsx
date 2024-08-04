'use client'

import MainContainer from '@/components/layout/MainContainer'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import {
	Box,
	Flex,
	Alert,
	AlertIcon,
	Text,
	IconButton,
	Tooltip,
	useColorMode,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import MainLeftNav from '@/components/layout/MainLeftNav'
import { DEFAULT_PADDING } from '@/configs/theme'
import MainHeader from '@/components/layout/MainHeader'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { FaAngleLeft } from 'react-icons/fa'
import SherutaDB from '@/firebase/service/index.firebase'
import { RequestData } from '@/firebase/service/request/request.types'
import EditSeekerForm from '@/components/forms/EditSeekerForm'

type Props = {
	params: any
}

export default function Page({ params }: Props) {
	const router = useRouter()
	const { colorMode } = useColorMode()

	const [isLoading, setIsLoading] = useState<boolean>(false)

	const [formData, setFormData] = useState<Partial<RequestData>>({})

	const requestId = params.request_id

	const getRequest = async (): Promise<any> => {
		try {
			setIsLoading(true)

			const result = await SherutaDB.get({
				collection_name: 'requests',
				document_id: requestId as string,
			})

			if (result && Object.keys(result).length) {
				setFormData(result)
			} else {
				router.replace('/')
			}
		} catch (error: any) {
			console.log(error)
			setIsLoading(false)
		}
	}

	useEffect(() => {
		getRequest()
	}, [])

	return (
		<Flex justifyContent={'center'}>
			<MainContainer>
				<ThreeColumnLayout header={<MainHeader />}>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>
					<Box p={DEFAULT_PADDING}>
						<Box marginBottom={10}>
							<Box marginBottom={10}>
								<Flex align="center" mb={5}>
									<Tooltip
										bgColor={colorMode === 'dark' ? '#fff' : 'gray.300'}
										hasArrow
										label={'Go Back'}
										color={colorMode === 'dark' ? 'black' : 'black'}
									>
										<IconButton
											onClick={() => router.back()}
											aria-label="Search database"
											icon={<FaAngleLeft />}
											variant="outline"
											border={colorMode === 'light' ? '1px solid #ddd' : ''}
											_hover={{ bg: 'transparent' }}
											_focus={{ boxShadow: 'none' }}
											_active={{ bg: 'transparent' }}
										/>
									</Tooltip>

									<Text fontSize="2xl" ml={4} fontWeight="bold">
										Update Your Flat Request
									</Text>
								</Flex>
								<Text marginBottom={3} color="gray">
									Updating your request for a flat? Modify your post and let
									like-minded people reach out to you.
								</Text>
								<Alert status="info">
									<Flex direction="row" alignItems="center">
										<AlertIcon />
										<span>
											{
												'Have a vacant space? Increase occupancy rate by posting visuals. '
											}
											<NextLink href={'/request/host'}>
												<Text as="u">Click here</Text>
											</NextLink>
											{' to post with visuals.'}
										</span>
									</Flex>
								</Alert>
							</Box>
						</Box>
						<Box maxWidth="600px" mx="auto">
							<EditSeekerForm requestId={requestId} editFormData={formData} />
						</Box>
					</Box>
				</ThreeColumnLayout>
			</MainContainer>
		</Flex>
	)
}
