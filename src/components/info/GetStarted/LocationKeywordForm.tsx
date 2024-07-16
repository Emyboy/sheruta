import { DEFAULT_PADDING } from '@/configs/theme'
import { Button, Flex, Input, Select, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

export default function LocationKeywordForm({ done }: { done: () => void }) {
	const [isLoading, setIsLoading] = useState(false)
	const [location, setLocation] = useState('')
	const [state, setState] = useState('')

	return (
		<>
			<Flex
				//   onSubmit={update}
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
							<Select placeholder="Select option" bg="dark">
								<option value="option1">Option 1</option>
								<option value="option2">Option 2</option>
								<option value="option3">Option 3</option>
							</Select>
							<Input
								required
								value={state}
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
								Location
							</Text>
							<Input
								required
								value={location}
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Ex. Jane"
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
