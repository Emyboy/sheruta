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

type Props = {}

export default function Page({}: Props) {
	const router = useRouter()

	const handleBackClick = () => {
		router.back()
	}

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
								<Flex align="center" mb={4}>
									<IconButton
										onClick={handleBackClick}
										aria-label="Search database"
										icon={<FaAngleLeft />}
										variant="ghost"
										_hover={{ bg: 'transparent' }}
										_focus={{ boxShadow: 'none' }}
										_active={{ bg: 'transparent' }}
									/>

									<Text fontSize="3xl" fontWeight="bold">
										Post Your Flat Request
									</Text>
								</Flex>
								<Text marginBottom={3} color="gray">
									Looking for flat? Post your request and have like minded
									people reach out to you.
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
							<CreateSeekerForm />
						</Box>
					</Box>
				</ThreeColumnLayout>
			</MainContainer>
		</Flex>
	)
}
