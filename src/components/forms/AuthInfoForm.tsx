import { Button, Flex, Input, Text, Textarea, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { DEFAULT_PADDING } from '@/configs/theme'
import CurrencyInput from 'react-currency-input-field'
import { useAuthContext } from '@/context/auth.context'
import FlatShareProfileService from '@/firebase/service/flat-share-profile/flat-share-profile.firebase'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import AuthService from '@/firebase/service/auth/auth.firebase'

export default function AuthInfoForm({ done }: { done: () => void }) {
	const {
		authState: { flat_share_profile, user, user_info },
		getAuthDependencies,
	} = useAuthContext()
	const [first_name, setFirstName] = useState(user?.first_name || '')
	const [last_name, setLastName] = useState(user?.last_name || '')
	const [primary_phone_number, setPhoneNumber] = useState(
		user_info?.primary_phone_number || '',
	)
	const [budget, setBudget] = useState(flat_share_profile?.budget || 0)

	const [bio, setBio] = useState(flat_share_profile?.bio || '')

	const [isLoading, setIsLoading] = useState(false)

	const update = async (e: any) => {
		e.preventDefault()
		if (first_name && last_name && budget && primary_phone_number && user) {
			setIsLoading(true)

			await AuthService.update({
				data: { first_name, last_name },
				document_id: user._id,
			})

			await UserInfoService.update({
				data: { primary_phone_number },
				document_id: user._id,
			})

			await FlatShareProfileService.update({
				data: { budget, bio },
				document_id: user?._id,
			})

			await getAuthDependencies()

			setIsLoading(false)

			if (done) {
				done()
			}
		}
	}

	return (
		<>
			<Flex
				onSubmit={update}
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
								required
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
				<Button type={'submit'} isLoading={isLoading}>{`Next`}</Button>
			</Flex>
		</>
	)
}
