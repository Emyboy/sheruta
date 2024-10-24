'use client'

import SearchProfileCard, {
	UserProfile,
} from '@/components/ads/SearchProfileCard'
import EachRequest from '@/components/EachRequest/EachRequest'
import { DEFAULT_PADDING } from '@/configs/theme'
import {
	FlatShareRequest,
	HostRequestDataDetails,
} from '@/firebase/service/request/request.types'
import { Flex, Text } from '@chakra-ui/react'
import ListOfFilters from './(components)/ListOfFilters'
import NoApartment from './(components)/NoApartment'

export default function SearchPage({
	type,
	requests,
}: {
	type: string
	requests: FlatShareRequest[]
}) {
	return (
		<Flex flexDir={'column'} gap={DEFAULT_PADDING}>
			<ListOfFilters length={requests.length} />
			{requests.length ? (
				requests.map((request, i) => (
					<Flex key={i} mt={'-20px'} padding={DEFAULT_PADDING}>
						{type === 'apartment' ? (
							<EachRequest request={request} />
						) : (
							// <SearchProfileCard profile={request as UserProfile} />
							<Text p={4}>Coming soon</Text>
						)}
					</Flex>
				))
			) : (
				<NoApartment />
			)}
		</Flex>
	)
}
