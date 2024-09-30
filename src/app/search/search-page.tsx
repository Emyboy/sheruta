'use client'

import { DEFAULT_PADDING } from '@/configs/theme'
import { Flex } from '@chakra-ui/react'
import ListOfFilters from './(components)/ListOfFilters'
import { HostRequestDataDetails } from '@/firebase/service/request/request.types'
import EachRequest from '@/components/EachRequest/EachRequest'
import NoApartment from './(components)/NoApartment'

export default function SearchPage({ requests }: { requests: string }) {
	const flatShareRequests: HostRequestDataDetails[] = JSON.parse(requests) || []

	return (
		<Flex flexDir={'column'} gap={DEFAULT_PADDING}>
			<ListOfFilters length={flatShareRequests.length} />
			{flatShareRequests.length ? (
				flatShareRequests.map((request, i) => (
					<Flex key={i} mt={'-20px'} padding={DEFAULT_PADDING}>
						<EachRequest request={request} />
					</Flex>
				))
			) : (
				<NoApartment />
			)}
		</Flex>
	)
}
