'use client'
import { DEFAULT_PADDING } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
import FlatShareProfileService from '@/firebase/service/flat-share-profile/flat-share-profile.firebase'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import UserService from '@/firebase/service/user/user.firebase'
import useCommon from '@/hooks/useApp'
import { Button, Flex, Input, Select, Text, VStack } from '@chakra-ui/react'
import { serverTimestamp } from 'firebase/firestore'
import React, { useState } from 'react'
import CurrencyInput from 'react-currency-input-field'

type Props = {
	next: () => void
}

export default function OnboardingForm({ }: Props) {
	const {
		CommonState: { loading },
		setCommonState,
		showToast,
	} = useCommon()
	const { authState, getAuthDependencies } = useAuthContext()
	const { user } = authState
	const [firstName, setFirstName] = useState(user?.first_name)
	const [lastName, setLastName] = useState(user?.last_name)
	const [budget, setBudget] = useState<number | null>(null)
	const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
	const [gender, setGender] = useState<any>('')

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault()
			if (!budget || !gender) {
				return showToast({ message: "Budget and gender are required", status: 'info' })
			}
			setCommonState({ loading: true })
			await UserService.update({
				document_id: user?._id as string,
				data: {
					first_name: firstName,
					last_name: lastName,
					last_seen: serverTimestamp(),
				},
			})
			await FlatShareProfileService.update({
				document_id: user?._id as string,
				data: {
					budget,
				},
			})
			await UserInfoService.update({
				document_id: user?._id as string,
				data: {
					primary_phone_number: String(phoneNumber),
					gender
				},
			})
			await getAuthDependencies()
			showToast({
				message: 'Changes saved 🎉',
				status: 'success',
			})
			setCommonState({ loading: false })
		} catch (error) {
			setCommonState({ loading: false })
			showToast({
				message: 'Error, please try again',
				status: 'error',
			})
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<VStack
				justifyContent={'flex-start'}
				p={DEFAULT_PADDING}
				w="full"
				gap={DEFAULT_PADDING}
			>
				<VStack mb={2}>
					<Text fontSize={'xl'} fontWeight={'bold'}>
						Almost Done 🙏🏽
					</Text>
					<Text
						color={'text_muted'}
					>{`We're just confirming the information we have.`}</Text>
				</VStack>
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
							value={firstName}
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
							Last Name
						</Text>
						<Input
							onChange={(e) => setLastName(e.target.value)}
							required
							value={lastName}
							borderColor={'border_color'}
							_dark={{ borderColor: 'dark_light' }}
							placeholder="Ex. Jane"
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
							value={phoneNumber as any}
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
							Gender
						</Text>
						<Select
							placeholder="Select one"
							bg="dark"
							onChange={(e) => setGender(e.target.value)}
						>
							<option value="male">Male</option>
							<option value="female">Female</option>
						</Select>
					</Flex>
				</Flex>
				<Flex justifyContent={'flex-start'} flexDir={'column'} w="full" gap={2}>
					<Text color={'text_muted'} fontSize={'sm'}>
						Budget
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
						id="input-example"
						name="input-name"
						placeholder="Please enter a budget"
						defaultValue={budget as number}
						decimalsLimit={2}
						onValueChange={(value) => setBudget(parseInt(value as string))}
					/>
				</Flex>
				<Button w="full" bg="brand" colorScheme="" type="submit" isLoading={loading}>
					Finish
				</Button>
			</VStack>
		</form>
	)
}
