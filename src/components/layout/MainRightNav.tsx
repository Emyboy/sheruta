import { DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'
import { AnalyticsDataDetails } from '@/firebase/service/analytics/analytics.types'
import useAnalytics from '@/hooks/useAnalytics'
import { Divider, Flex, Icon, Text } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { FaFireFlameCurved } from 'react-icons/fa6'

type Props = {}

export default function MainRightNav({ }: Props) {

	const { getTrendingLocations, isAnalyticsLoading } = useAnalytics();
	const [trendingLocations, setTrendingLocations] = useState<AnalyticsDataDetails[] | null>(null);

	useEffect(() => {
		const fetchTrendingLocations = async () => {
			try {
				console.log('sese')
				const locations = await getTrendingLocations();
				setTrendingLocations(locations);
			} catch (error) {
				console.error("Error fetching trending locations:", error);
			}
		};

		fetchTrendingLocations();
	}, []);

	return (
		<Flex
			minH={`calc(100vh - ${NAV_HEIGHT})`}
			flexDirection={'column'}
			pl={DEFAULT_PADDING}
			w="full"
			py={DEFAULT_PADDING}
		>
			<Flex
				p={DEFAULT_PADDING}
				bg="white"
				border={'1px'}
				borderColor={'border_color'}
				_dark={{
					bg: 'dark',
					borderColor: 'dark_light',
				}}
				rounded={'xl'}
				flexDirection={'column'}
				gap={DEFAULT_PADDING}
				w="full"
			>
				<Flex gap={2} flexDirection={'column'}>
					<Text fontSize={'lg'} color="dark_lighter">
						Trending Locations
					</Text>
					<Divider bg="dark_light" />
				</Flex>
				{
					isAnalyticsLoading ? (
						<Flex justifyContent={'center'} py={DEFAULT_PADDING}>
							<Text fontSize={'lg'} color="text_muted">Loading...</Text>
						</Flex>
					) : (
						trendingLocations?.map((data: any, index) => (
							<EachLocation key={index} location={data._location_keyword_ref.name} state={data._location_keyword_ref._state_ref.name} total={data.total} />
						))
					)
				}
			</Flex>
		</Flex>
	)
}

const EachLocation = ({ location, state, total }: { location: string, total: number, state: string }) => {
	return (
		<Flex alignItems={'flex-end'} gap={DEFAULT_PADDING} py={2} cursor={'pointer'}>
			<Flex flexDirection={'column'} maxW={'80%'}>
				<Text fontSize="md">{location + ', ' + state + ` state`}</Text>
				<Text isTruncated fontSize={'sm'} color="text_muted">
					This location has <Icon color="orange.500" as={FaFireFlameCurved} /> {(total === 1) ? total+' hit' : total+' hits'}
				</Text>
			</Flex>
		</Flex>
	)
}
