import { DEFAULT_PADDING } from '@/configs/theme'
import { LocationObject } from '@/firebase/service/request/request.types'
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
import { useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { FaCrown } from 'react-icons/fa'
import { LuInfo } from 'react-icons/lu'
import MainTooltip from '../atoms/MainTooltip'

export default function SearchLocation() {
	const [text, setText] = useState('')

	const [autocomplete, setAutocomplete] =
		useState<google.maps.places.Autocomplete | null>(null)

	const handleLoad = (autocompleteInstance: google.maps.places.Autocomplete) =>
		setAutocomplete(autocompleteInstance)

	const handlePlaceChanged = () => {
		if (autocomplete) {
			const place = autocomplete.getPlace()

			const locationObject: LocationObject = {
				formatted_address: place.formatted_address,
				geometry: place.geometry
					? {
							location: {
								lat: place.geometry.location?.lat() ?? 0,
								lng: place.geometry.location?.lng() ?? 0,
							},
						}
					: undefined,
			}

			setText(locationObject.formatted_address || text)
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
					<LoadScript
						googleMapsApiKey={
							process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY as string
						}
						libraries={['places']}
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
					</LoadScript>
				</Flex>
			</Box>
		</Flex>
	)
}
