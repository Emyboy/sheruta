import { DEFAULT_PADDING } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
import useAuthenticatedAxios from '@/hooks/useAxios'
import {
	Button,
	Flex,
	Input,
	Select,
	Text,
	Textarea,
	VStack,
} from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import CurrencyInput from 'react-currency-input-field'

export default function AuthInfoForm({ done }: { done: () => void }) {
	const {
		authState: { flat_share_profile, user, user_info },
		setAuthState,
	} = useAuthContext()

	const axiosInstance = useAuthenticatedAxios()

	const [first_name, setFirstName] = useState(user?.first_name || '')
	const [last_name, setLastName] = useState(user?.last_name || '')
	const [primary_phone_number, setPhoneNumber] = useState(
		user_info?.primary_phone_number || '',
	)
	const [budget, setBudget] = useState(flat_share_profile?.budget || 0)

	const [bio, setBio] = useState(flat_share_profile?.bio || '')

	const [payment_type, setPaymentType] = useState(
		flat_share_profile?.payment_type ? flat_share_profile.payment_type[0] : '',
	)

	const [isLoading, setIsLoading] = useState(false)

	const { mutate } = useMutation({
		mutationFn: async () => {
			if (!axiosInstance) return null

			if (user) {
				setIsLoading(true)
				await Promise.all([
					axiosInstance.put('/user-info', {
						gender: user_info?.gender,
						primary_phone_number,
					}),
					axiosInstance.put('/flat-share-profile', {
						// ...flat_share_profile,
						budget,
						bio,
						payment_type: [payment_type],
					}),
					axiosInstance.put('/users', {
						// ...user,
						first_name,
						last_name,
					}),
				])
			}
		},
		onSuccess: () => {
			setAuthState({
				// @ts-ignore
				flat_share_profile: {
					...flat_share_profile,
					budget,
					bio,
					// @ts-ignore
					payment_type: [payment_type],
				},
				// @ts-ignore
				user: { ...user, first_name, last_name },
				// @ts-ignore
				user_info: { ...user_info, primary_phone_number },
			})
			setIsLoading(false)
			if (done) {
				done()
			}
		},
		onError: (err) => {
			console.error(err)
			setIsLoading(false)
		},
	})

	return (
		<>
			<Flex
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
					Update profile
				</Text>
				<Text textAlign={'center'} color={'dark_lighter'}>
					Nothing builds trust more than a complete profile.
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
								First Name
							</Text>
							<Input
								onChange={(e) => setFirstName(e.target.value)}
								required
								value={first_name}
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Ex. Jane"
							/>
						</Flex>
						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={2}
						>
							<Text color={'text_muted'} fontSize={'sm'}>
								Last Name <small>{`(private)`}</small>
							</Text>
							<Input
								onChange={(e) => setLastName(e.target.value)}
								required
								value={last_name}
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Ex. Doe"
							/>
						</Flex>
					</Flex>

					<Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={2}
						>
							<Text color={'text_muted'} fontSize={'sm'}>
								Phone Number
							</Text>
							<Input
								required
								value={primary_phone_number as any}
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Ex. +234 12345678"
								type="number"
								onChange={(e) => setPhoneNumber(e.target.value)}
							/>
						</Flex>
						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={2}
						>
							<Text color={'text_muted'} fontSize={'sm'}>
								{flat_share_profile?.seeking ? 'Budget' : 'Rent'}
							</Text>
							<CurrencyInput
								style={{
									padding: 8,
									paddingLeft: 19,
									borderRadius: 5,
									outline: 'none',
									background: 'none',
									border: '1px solid #313E3D',
								}}
								prefix="₦ "
								id="input-name"
								name="input-name"
								placeholder="Please enter a figure"
								defaultValue={budget}
								decimalsLimit={2}
								onValueChange={(value) => setBudget(parseInt(value as string))}
							/>
						</Flex>
						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={2}
						>
							<Text color={'text_muted'} fontSize={'sm'}>
								Payment plan
							</Text>
							<Select
								placeholder="Select option"
								bg="dark"
								required
								onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
									setPaymentType(e.target.value)
								}
								value={payment_type}
							>
								<option value="daily">Daily</option>
								<option value="weekly">Weekly</option>
								<option value="monthly">Monthly</option>
								<option value="biannually">Bi-annually</option>
								<option value="annually">Annually</option>
							</Select>
						</Flex>
					</Flex>
					<Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={2}
						>
							<Text color={'text_muted'} fontSize={'sm'}>
								{`Let us know why you're here`}
							</Text>
							<Textarea
								placeholder="Ex: Searching for a vacant space in Lekki, go through my profile"
								onChange={(e) => {
									setBio(e.target.value)
								}}
								value={bio}
							/>
						</Flex>
					</Flex>
				</VStack>
				<br />
				<Button
					type={'submit'}
					isDisabled={
						!first_name ||
						!last_name ||
						!budget ||
						!primary_phone_number ||
						!payment_type
					}
					isLoading={isLoading}
				>{`Next`}</Button>
			</Flex>
		</>
	)
}
