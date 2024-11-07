'use client'

import { DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'
import { AnalyticsDataDetails } from '@/firebase/service/analytics/analytics.types'
import useAnalytics from '@/hooks/useAnalytics'
import { Divider, Flex, Image, Text } from '@chakra-ui/react'
import { useState, useEffect } from 'react'

export default function TrendingLocations({}: {}) {
	const { getTrendingLocations, isAnalyticsLoading } = useAnalytics()
	const [trendingLocations, setTrendingLocations] = useState<
		AnalyticsDataDetails[] | null
	>(null)

	useEffect(() => {
		const fetchTrendingLocations = async () => {
			try {
				const locations = await getTrendingLocations()
				const limitedLocations = locations?.slice(0, 10) || []

				setTrendingLocations(limitedLocations)
			} catch (error) {
				console.error('Error fetching trending locations:', error)
			}
		}

		fetchTrendingLocations()
	}, [])

	return (
		<>
			<Text fontSize={'2xl'} mb={5} fontWeight={'bold'}>
				Trending Locations
			</Text>
			<Flex
				p={DEFAULT_PADDING}
				bg="white"
				// border={'1px'}
				// borderColor={'border_color'}
				_dark={{
					bg: 'dark',
					borderColor: 'dark_light',
				}}
				rounded={'xl'}
				flexDirection={'column'}
				gap={DEFAULT_PADDING}
				w="full"
			>
				{isAnalyticsLoading ? (
					<Flex justifyContent={'center'} py={DEFAULT_PADDING}>
						<Text fontSize={'lg'} color="text_muted">
							Loading...
						</Text>
					</Flex>
				) : (
					trendingLocations?.map((data: any, index) => (
						<EachLocation
							key={index}
							location={data._location_keyword_ref.name}
							state={data._location_keyword_ref._state_ref.name}
							total={data.total}
							image={data._location_keyword_ref?.image_url || undefined}
						/>
					))
				)}
			</Flex>
		</>
	)
}

const EachLocation = ({
	location,
	state,
	total,
	image,
}: {
	location: string
	total: number
	state: string
	image?: string
}) => {
	return (
		<Flex alignItems={'center'} gap={DEFAULT_PADDING} py={2} cursor={'pointer'}>
			<Image src={image} alt="location" width={35} rounded={'md'} />
			<Flex flexDirection={'column'} maxW={'80%'}>
				<Text fontSize="md">{location + ', ' + state + ` state`}</Text>
				<Text isTruncated fontSize={'sm'} color="text_muted">
					This location has {total === 1 ? total + ' hit' : total + ' hits'}
				</Text>
			</Flex>
		</Flex>
	)
}
