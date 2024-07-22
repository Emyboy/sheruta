'use client'

import MainContainer from '@/components/layout/MainContainer'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { Box, Flex, Alert, AlertIcon, Text } from '@chakra-ui/react'
import React from 'react'
import MainLeftNav from '@/components/layout/MainLeftNav'
import { DEFAULT_PADDING } from '@/configs/theme'
import MainHeader from '@/components/layout/MainHeader'
import CreateSeekerForm from '@/components/forms/CreateSeekerForm'
import NextLink from 'next/link'

type Props = {}

export default function page({ }: Props) {
	return (
		<Flex justifyContent={'center'}>
			<MainContainer>
				<ThreeColumnLayout header={<MainHeader />}>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>
					<Box p={DEFAULT_PADDING}>
						<Box marginBottom={10}>
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
						<Box maxWidth="600px" mx="auto">
							<CreateSeekerForm />
						</Box>
					</Box>
				</ThreeColumnLayout>
			</MainContainer>
		</Flex>
	)
}
