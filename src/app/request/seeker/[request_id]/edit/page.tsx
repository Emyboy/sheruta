import MainContainer from '@/components/layout/MainContainer'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { Box, Flex, Alert, AlertIcon, Text } from '@chakra-ui/react'
import MainLeftNav from '@/components/layout/MainLeftNav'
import { DEFAULT_PADDING } from '@/configs/theme'
import MainHeader from '@/components/layout/MainHeader'
import NextLink from 'next/link'
import EditSeekerForm from '@/components/forms/EditSeekerForm'
import { getSeekerRequestData } from '../page'

type Props = {
	params: any
}

export default async function Page({ params }: Props) {
	const requestId = params.request_id

	const requestData: string | undefined = await getSeekerRequestData(requestId)

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
								<Flex align="center" justifyContent={'center'} mb={2}>
									<Text fontSize="2xl" fontWeight="bold">
										Update Your Flat Request
									</Text>
								</Flex>
								<Text marginBottom={4} textAlign={'center'} color="gray">
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
							<EditSeekerForm requestId={requestId} requestData={requestData} />
						</Box>
					</Box>
				</ThreeColumnLayout>
			</MainContainer>
		</Flex>
	)
}
