'use client'

import ApartmentSummary from '@/components/HostDetails/ApartmentSummary'
import { HostRequestDataDetails } from '@/firebase/service/request/request.types'
import { Flex, Text } from '@chakra-ui/react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { NINResponseDTO } from '../types'

const mini_nav_items = [
	'Apartment Summary',
	'Discussion',
	'Verification',
	'Pay Details',
]

export default function ApartmentDetails({
	request,
	discussions,
	hostNinData,
}: {
	request: string
	discussions: string | undefined
	hostNinData: NINResponseDTO | undefined
}) {
	const params = useSearchParams()
	const [activeTab, setActiveTab] = useState(
		params.get('tab')?.toString() || 'Apartment Summary',
	)

	const parsedRequest: HostRequestDataDetails = JSON.parse(request)

	const parsedDiscussions = discussions ? JSON.parse(discussions) : undefined

	return (
		<>
			<Flex
				minH="70px"
				maxH="70px"
				minW="100%"
				borderBottom="1px"
				borderColor="brand_darker"
				_light={{ borderColor: '#1117171A' }}
				alignItems="center"
				justifyContent="center"
			>
				<Flex
					gap={{ base: '16px', md: '32px' }}
					alignItems="center"
					justifyContent="center"
					maxH="58px"
					overflowX="auto"
					overflowY={'hidden'}
					flex={1}
					alignSelf="end"
					w="100%"
					mx={{ base: '16px', md: 0 }}
				>
					{mini_nav_items.map((item, i) => (
						<Flex
							key={i}
							alignItems="center"
							flexDirection="column"
							justifyContent="space-between"
							height={{ base: '48px', md: '58px' }}
							cursor="pointer"
							w="auto"
							onClick={() => setActiveTab(item)}
						>
							<Text
								as="p"
								fontWeight="normal"
								textAlign="center"
								fontSize={{ base: '12px', md: '16px' }}
								whiteSpace="nowrap"
							>
								{item}
							</Text>
							{activeTab === item && (
								<Text
									as="span"
									h="4px"
									w="full"
									borderRadius="4px"
									bg="brand"
								/>
							)}
						</Flex>
					))}
				</Flex>
			</Flex>

			{activeTab === 'Apartment Summary' && (
				<ApartmentSummary request={parsedRequest} />
			)}
			{/* {activeTab === 'Discussion' && (
				<DiscussionComponent
					requestId={parsedRequest.id}
					discussions={parsedDiscussions}
					hostId={parsedRequest._user_ref._id}
				/>
			)}
			{activeTab === 'Verification' && (
				<VerificationComponent
					request={parsedRequest}
					hostNinData={hostNinData}
				/>
			)} */}
			{activeTab === 'Pay Details' && <Text>Pay Details coming soon</Text>}
		</>
	)
}
