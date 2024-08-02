'use client'

import ApartmentSummary from '@/components/HostDetails/ApartmentSummary'
import { Flex, Text } from '@chakra-ui/react'
import { useState } from 'react'

const mini_nav_items = [
	'Apartment Summary',
	'Discussion',
	'Verification',
	'Pay Details',
]

export default function ApartmentDetails({ request }: { request: string }) {
	const [activeTab, setActiveTab] = useState('Apartment Summary')

	return (
		<>
			<Flex
				minH={'70px'}
				maxH={'70px'}
				borderBottom={'1px'}
				borderColor={'brand_darker'}
				alignItems={'center'}
				justifyContent={'center'}
				paddingInline={'5%'}
			>
				<Flex
					gap={'32px'}
					alignItems={'center'}
					justifyContent={'center'}
					maxH={'58px'}
					height={'100%'}
					flex={1}
					alignSelf={'end'}
				>
					{mini_nav_items.map((item, i) => (
						<Flex
							key={i}
							alignItems={'center'}
							flexDirection={'column'}
							justifyContent={'space-between'}
							height={'100%'}
							cursor={'pointer'}
							onClick={() => setActiveTab(item)}
						>
							<Text as="p" fontWeight={'normal'} fontSize={'16px'}>
								{item}
							</Text>
							{activeTab === item && (
								<Text
									as="span"
									h={'4px'}
									marginBottom={'-2px'}
									w={'100%'}
									borderRadius={'4px'}
									bg={'brand'}
								/>
							)}
						</Flex>
					))}
				</Flex>
			</Flex>
			{activeTab === 'Apartment Summary' && (
				<ApartmentSummary request={JSON.parse(request)} />
			)}
			{activeTab === 'Discussion' && <Text>Discussion coming soon</Text>}
			{activeTab === 'Verification' && <Text>Verification coming soon</Text>}
			{activeTab === 'Pay Details' && <Text>Pay Details coming soon</Text>}
		</>
	)
}
