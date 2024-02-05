'use client'
import { DEFAULT_PADDING } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
import { Button, Flex, Input, Select, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import CurrencyInput from 'react-currency-input-field'

type Props = {
	next: () => void
}

export default function OnboardingForm({}: Props) {
	const { authState } = useAuthContext()
	const { user } = authState
	const [firstName, setFirstName] = useState(user?.first_name)
	const [lastName, setLastName] = useState(user?.last_name)
	const [budget, setBudget] = useState(0)
	const [phoneNumber, setPhoneNumber] = useState<number | null>(null)

	return (
		<form>
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
					<Flex justifyContent={'flex-start'} flexDir={'column'} w="full" gap={2}>
						<Text color={'text_muted'} fontSize={'sm'}>
							First Name
						</Text>
						<Input
							required
							value={firstName}
							borderColor={'border_color'}
							_dark={{ borderColor: 'dark_light' }}
							placeholder="Ex. Jane"
						/>
					</Flex>
					<Flex justifyContent={'flex-start'} flexDir={'column'} w="full" gap={2}>
						<Text color={'text_muted'} fontSize={'sm'}>
							Last Name
						</Text>
						<Input
							required
							value={lastName}
							borderColor={'border_color'}
							_dark={{ borderColor: 'dark_light' }}
							placeholder="Ex. Jane"
						/>
					</Flex>
				</Flex>
				<Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
					<Flex justifyContent={'flex-start'} flexDir={'column'} w="full" gap={2}>
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
							onChange={(e) => setPhoneNumber(parseInt(e.target.value))}
						/>
					</Flex>
					<Flex justifyContent={'flex-start'} flexDir={'column'} w="full" gap={2}>
						<Text color={'text_muted'} fontSize={'sm'}>
							Gender
						</Text>
						<Select placeholder="Select one" bg="dark">
							<option value="option2">Male</option>
							<option value="option3">Female</option>
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
						prefix='₦ '
						id="input-example"
						name="input-name"
						placeholder="Please enter a number"
						defaultValue={1000}
						decimalsLimit={2}
						onValueChange={(value) =>
							setBudget(parseInt(value as string))
						}
					/>
				</Flex>
				<Button w="full" bg="brand" colorScheme="" type='submit'>
					Finish
				</Button>
			</VStack>
		</form>
	)
}
