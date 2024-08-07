import { DEFAULT_PADDING } from '@/configs/theme'
import { useOptionsContext } from '@/context/options.context'
import { LocationKeywordData } from '@/firebase/service/options/location-keywords/location-keywords.types'
import { StateData } from '@/firebase/service/options/states/states.types'
import {
	Button,
	Flex,
	Input,
	Select,
	Text,
	useToast,
	VStack,
} from '@chakra-ui/react'
import React, { FormEvent, useEffect, useState } from 'react'
import { useAuthContext } from '@/context/auth.context'
import FlatShareProfileService from '@/firebase/service/flat-share-profile/flat-share-profile.firebase'

export default function LocationKeywordForm({ done }: { done: () => void }) {
	const toast = useToast()
	const { optionsState: options } = useOptionsContext()
	const [isLoading, setIsLoading] = useState(false)
	const {
		authState: { user },
		getAuthDependencies,
	} = useAuthContext()

	const [stateRef, setStateRef] = useState<string>('')
	const [locationRef, setLocationRef] = useState<string>('')

	const updateLocation = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		let keyword = options.location_keywords.find(
			(x: LocationKeywordData) => x.id === locationRef,
		)
		let theState = options.states.find((x: StateData) => x.id === stateRef)

		if (keyword && theState && user && user._id) {
			try {
				setIsLoading(true)

				await FlatShareProfileService.update({
					data: {
						location_keyword: keyword._ref,
						state: theState._ref,
					},
					document_id: user._id,
				})
				await getAuthDependencies()
				setIsLoading(false)
				if (done) {
					done()
				}
			} catch (e) {
				toast({
					title: 'Error, please try again',
					status: 'error',
				})
			}
			setIsLoading(false)
		}
	}

	return (
		<>
			<Flex
				onSubmit={updateLocation}
				flexDir={'column'}
				justifyContent={'center'}
				alignItems={'center'}
				as={'form'}
			>
				<br />
				<br />
				<Text textAlign={'center'} as={'h1'} fontSize={'3xl'}>
					Set interested location
				</Text>
				<Text textAlign={'center'} color={'dark_lighter'}>
					Get discovered by people in your preferred location
				</Text>
				<br />
				<br />
				<VStack mb={3} w={'full'}>
					<Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={2}
						>
							<Text color={'text_muted'} fontSize={'sm'}>
								State
							</Text>
							<Select
								placeholder="Select state"
								bg="dark"
								onChange={(e) => setStateRef(e.target.value)}
							>
								{options.states.map((state: StateData) => {
									return (
										<option key={state.id} value={state.id}>
											{state.name}
										</option>
									)
								})}
							</Select>
						</Flex>
					</Flex>
					{stateRef && (
						<Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
							<Flex
								justifyContent={'flex-start'}
								flexDir={'column'}
								w="full"
								gap={2}
							>
								<Text color={'text_muted'} fontSize={'sm'}>
									Area
								</Text>
								<Select
									placeholder="Select area"
									bg="dark"
									onChange={(e) => setLocationRef(e.target.value)}
								>
									{options.location_keywords
										.filter(
											(loc: LocationKeywordData) => loc._state_id == stateRef,
										)
										.map((loc: LocationKeywordData) => {
											return (
												<option key={loc.id} value={loc.id}>
													{loc.name}
												</option>
											)
										})}
								</Select>
							</Flex>
						</Flex>
					)}
				</VStack>
				<br />
				<Button
					type={'submit'}
					isLoading={isLoading}
					isDisabled={!locationRef || !stateRef}
				>{`Next`}</Button>
			</Flex>
		</>
	)
}
