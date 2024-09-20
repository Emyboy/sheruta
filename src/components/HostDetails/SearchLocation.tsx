import { DEFAULT_PADDING } from '@/configs/theme'
import { libraries } from '@/constants'
import { LocationObject } from '@/firebase/service/request/request.types'
import { convertSeconds } from '@/utils/index.utils'
import {
	Box,
	Button,
	Flex,
	Input,
	InputGroup,
	InputLeftElement,
	Text,
} from '@chakra-ui/react'
import { Autocomplete, LoadScript } from '@react-google-maps/api'
import axios from 'axios'
import { useCallback, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { FaCrown } from 'react-icons/fa'
import { LuInfo } from 'react-icons/lu'
import MainTooltip from '../atoms/MainTooltip'

type LatLng = {
	lat: number
	lng: number
}

export default function SearchLocation({ location }: { location: LatLng }) {
	const [text, setText] = useState('')

	const [routes, setRoutes] = useState<{
		distanceMeters: number
		duration: string
	}>()

	const [autocomplete, setAutocomplete] =
		useState<google.maps.places.Autocomplete | null>(null)

	const handleLoad = useCallback(
		(autocompleteInstance: google.maps.places.Autocomplete) =>
			setAutocomplete(autocompleteInstance),
		[],
	)

	const handlePlaceChanged = useCallback(async () => {
		if (!autocomplete) return

		const place = autocomplete.getPlace()
		const formatted_address = place.formatted_address || text
		const { lat, lng } = place.geometry?.location || {}

		const locationObject: LocationObject = {
			formatted_address,
			geometry:
				lat && lng ? { location: { lat: lat(), lng: lng() } } : undefined,
		}

		setText(locationObject.formatted_address || '')

		if (locationObject.geometry?.location) {
			await calcDistance(locationObject.geometry.location)
		}
	}, [autocomplete, text])

	const calcDistance = async (destination: LatLng) => {
		const data = {
			origin: {
				location: {
					latLng: {
						latitude: location.lat,
						longitude: location.lng,
					},
				},
			},
			destination: {
				location: {
					latLng: {
						latitude: destination.lat,
						longitude: destination.lng,
					},
				},
			},
			travelMode: 'DRIVE',
			routingPreference: 'TRAFFIC_AWARE',
			computeAlternativeRoutes: true,
			routeModifiers: {
				avoidTolls: false,
				avoidHighways: false,
				avoidFerries: false,
			},
			languageCode: 'en-US',
			units: 'IMPERIAL',
		}

		const config = {
			headers: {
				'Content-Type': 'application/json',
				'X-Goog-Api-Key': process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
				'X-Goog-FieldMask':
					'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
			},
		}

		try {
			const response = await axios.post(
				'https://routes.googleapis.com/directions/v2:computeRoutes',
				data,
				config,
			)
			const routeData = await response.data.routes[0]
			setRoutes(routeData)
			setText('')
		} catch (error) {
			console.error('Error fetching routes:', error)
		}
	}

	return (
		<Flex
			mt={{ base: '24px', sm: '32px' }}
			flexDir={'column'}
			gap={'20px'}
			mb={'120px'}
		>
			<Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight={'300'}>
				Apartment Location
			</Text>
			<Box
				p={DEFAULT_PADDING}
				bgColor={'##11171708'}
				_dark={{ bgColor: 'lightgray' }}
			>
				<Flex
					justifyContent={'flex-start'}
					flexDir={'column'}
					w="full"
					p={DEFAULT_PADDING}
					bgColor={'white'}
					rounded={'8px'}
				>
					<Flex
						alignItems={'center'}
						gap={DEFAULT_PADDING}
						justifyContent={'space-between'}
					>
						<Flex alignItems={'center'} gap={2} pos={'relative'}>
							<Text color={'text_muted'} fontSize={'base'}>
								Search Location on Map
							</Text>
							<MainTooltip
								label="This helps you calculate the distance between the entered
											 location and the apartment location"
								placement="top"
							>
								<Button
									p={0}
									bg="none"
									color="text_muted"
									display={'flex'}
									fontWeight={'light'}
									_hover={{
										color: 'brand',
										bg: 'none',
										_dark: {
											color: 'brand',
										},
									}}
									_dark={{
										color: 'dark_lighter',
									}}
									fontSize={{
										md: 'xl',
										base: 'lg',
									}}
									ml={'-12px'}
								>
									<LuInfo color="#00bc73" />
								</Button>
							</MainTooltip>
						</Flex>
						<MainTooltip
							label="using this feature is not free and requires credits"
							placement="top"
						>
							<Button
								p={0}
								mr={'-12px'}
								bg="none"
								color="text_muted"
								display={'flex'}
								fontWeight={'light'}
								_hover={{
									color: 'brand',
									bg: 'none',
									_dark: {
										color: 'brand',
									},
								}}
								_dark={{
									color: 'dark_lighter',
								}}
								fontSize={{
									md: 'xl',
									base: 'lg',
								}}
							>
								<FaCrown color="gold" />
							</Button>
						</MainTooltip>
					</Flex>
					{(typeof window !== 'undefined' && !window.google) ?
						<LoadScript
							googleMapsApiKey={
								process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY as string
							}
							libraries={libraries}
						>
							<Autocomplete
								onLoad={handleLoad}
								onPlaceChanged={handlePlaceChanged}
							>
								<InputGroup>
									<InputLeftElement pointerEvents="none">
										<CiSearch color="gray" />
									</InputLeftElement>
									<Input
										type="text"
										color={'gray'}
										borderColor={'border_color'}
										_dark={{ borderColor: 'dark_light' }}
										placeholder="Search Location"
										bgColor={'white'}
										_placeholder={{ color: 'text_muted' }}
										_focus={{ ring: 0, outline: 0 }}
										value={text}
										onChange={(e) => setText(e.target.value)}
									/>
								</InputGroup>
							</Autocomplete>
						</LoadScript> : <Autocomplete
							onLoad={handleLoad}
							onPlaceChanged={handlePlaceChanged}
						>
							<InputGroup>
								<InputLeftElement pointerEvents="none">
									<CiSearch color="gray" />
								</InputLeftElement>
								<Input
									type="text"
									color={'gray'}
									borderColor={'border_color'}
									_dark={{ borderColor: 'dark_light' }}
									placeholder="Search Location"
									bgColor={'white'}
									_placeholder={{ color: 'text_muted' }}
									_focus={{ ring: 0, outline: 0 }}
									value={text}
									onChange={(e) => setText(e.target.value)}
								/>
							</InputGroup>
						</Autocomplete>
					}

					<Flex mt={'8px'} flexDir={'column'} gap={'8px'}>
						<Text fontWeight={'600'} fontSize={'2xl'} color={'dark'}>
							Distance:{' '}
							{routes?.distanceMeters
								? `${routes?.distanceMeters} meters`
								: null}
						</Text>
						<Text fontWeight={'600'} fontSize={'2xl'} color={'dark'}>
							Time taken:{' '}
							{convertSeconds(Number(routes?.duration.slice(0, -1)))}
						</Text>
					</Flex>
				</Flex>
			</Box>
		</Flex>
	)
}
