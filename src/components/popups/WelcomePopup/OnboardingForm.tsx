import { DEFAULT_PADDING } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
import { Button, Flex, Input, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

type Props = {
	next: () => void
}

export default function OnboardingForm({ }: Props) {
	const { authState } = useAuthContext();
	const { user } = authState;
	const [firstName, setFirstName] = useState(user?.first_name);
	const [lastName, setLastName] = useState(user?.last_name);
	const [email, setEmail] = useState(user?.email);
	
	return (
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
			<Flex gap={DEFAULT_PADDING} w="full">
				<Flex justifyContent={'flex-start'} flexDir={'column'} w="full" gap={2}>
					<Text>First Name</Text>
					<Input
						value={firstName}
						borderColor={'border_color'}
						_dark={{ borderColor: 'dark_light' }}
						placeholder="Ex. Jane"
					/>
				</Flex>
				<Flex justifyContent={'flex-start'} flexDir={'column'} w="full" gap={2}>
					<Text>First Name</Text>
					<Input
						value={lastName}
						borderColor={'border_color'}
						_dark={{ borderColor: 'dark_light' }}
						placeholder="Ex. Jane"
					/>
				</Flex>
			</Flex>
			<Flex justifyContent={'flex-start'} flexDir={'column'} w="full" gap={2}>
				<Text opacity={'0.4'}>Email</Text>
				<Input
					value={email}
					borderColor={'border_color'}
					_dark={{ borderColor: 'dark_light' }}
					placeholder="Ex. Jane"
					type="email"
					disabled
				/>
			</Flex>
			<Button w="full" bg="brand" colorScheme="">
				Finish
			</Button>
		</VStack>
	)
}
