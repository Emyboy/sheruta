import { DEFAULT_PADDING } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
import { useOptionsContext } from '@/context/options.context'
import { LocationKeywordData } from '@/firebase/service/options/location-keywords/location-keywords.types'
import { StateData } from '@/firebase/service/options/states/states.types'
import useAuthenticatedAxios from '@/hooks/useAxios'
import { Button, Flex, Select, Text, VStack } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

export default function LocationKeywordForm({ done }: { done: () => void }) {
	const { optionsState: options } = useOptionsContext()

	const [isLoading, setIsLoading] = useState(false)
	const {
		authState: { user, flat_share_profile },
		setAuthState,
	} = useAuthContext()

	const axiosInstance = useAuthenticatedAxios()

	const [state, setState] = useState<string>(flat_share_profile?.state || '')
	const [location, setLocation] = useState<string>(
		// @ts-ignore
		flat_share_profile.location || '',
	)

	const { mutate } = useMutation({
		mutationFn: async () => {
			if (user) {
				setIsLoading(true)

				await axiosInstance.put('/flat-share-profile', {
					state,
					location,
				})
			}
		},
		onSuccess: () => {
			setAuthState({
				// @ts-ignore
				flat_share_profile: { ...flat_share_profile, state, location },
			})

			setIsLoading(false)
			if (done) {
				done()
			}
		},
		onError: (err) => {
			setIsLoading(false)
			console.error(err)
		},
	})

	return (
		<>
			<Flex
				// @ts-ignore
				onSubmit={(e) => {
					e.preventDefault()
					mutate()
				}}
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
								textTransform={'capitalize'}
								value={state}
								onChange={(e) => setState(e.target.value)}
							>
								{options.states.map((state) => {
									return (
										<option
											key={state._id}
											value={state._id}
											style={{
												textTransform: 'capitalize',
											}}
										>
											{state.name}
										</option>
									)
								})}
							</Select>
						</Flex>
					</Flex>
					{state && (
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
									value={location}
									textTransform={'capitalize'}
									onChange={(e) => setLocation(e.target.value)}
								>
									{options.locations
										.filter((loc) => loc.state == state)
										.map((loc) => {
											return (
												<option
													key={loc._id}
													value={loc._id}
													style={{
														textTransform: 'capitalize',
													}}
												>
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
					isDisabled={!location || !state}
				>{`Next`}</Button>
			</Flex>
		</>
	)
}
