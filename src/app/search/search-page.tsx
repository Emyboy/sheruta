'use client'

import SearchProfileCard from '@/components/ads/SearchProfileCard'
import EachRequest from '@/components/EachRequest/EachRequest'
import { DEFAULT_PADDING } from '@/configs/theme'
import { HostRequestDataDetails } from '@/firebase/service/request/request.types'
import { UserProfile } from '@/firebase/service/userProfile/user-profile-types'
import { Flex } from '@chakra-ui/react'
import ListOfFilters from './(components)/ListOfFilters'
import NoApartment from './(components)/NoApartment'

export default function SearchPage({
	type,
	requests,
}: {
	type: string
	requests: string
}) {
	const flatShareRequests: HostRequestDataDetails[] | UserProfile[] =
		JSON.parse(requests) || []

	return (
		<Flex flexDir={'column'} gap={DEFAULT_PADDING}>
			<ListOfFilters length={flatShareRequests.length} />
			{flatShareRequests.length ? (
				flatShareRequests.map((request, i) => (
					<Flex key={i} mt={'-20px'} padding={DEFAULT_PADDING}>
						{type === 'apartment' ? (
							<EachRequest request={request as HostRequestDataDetails} />
						) : (
							<SearchProfileCard profile={request as UserProfile} />
						)}
					</Flex>
				))
			) : (
				<NoApartment />
			)}
		</Flex>
	)
}
