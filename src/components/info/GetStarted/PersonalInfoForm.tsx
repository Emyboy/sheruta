'use client'
import { DEFAULT_PADDING } from '@/configs/theme'
import { Button, Divider, Flex, Input, InputGroup, InputLeftAddon, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Select } from '@chakra-ui/react'
import { industries } from '@/constants'

type Props = {
	done?: () => void
}

export default function PersonalInfoForm({ }: Props) {
	const [isLoading, setIsLoading] = useState(false);
	const [occupation, setOccupation] = useState('');

	return (
		<>
			<Flex
				as='form'
				mt={{
					base: '30rem',
					md: '10px',
				}}
				flexDir={'column'}
				justifyContent={'center'}
				alignItems={'center'}
			>
				<Text
					textAlign={'center'}
					as={'h1'}
					fontSize={'3xl'}
					className={'animate__animated animate__fadeInUp animate__faster'}
				>
					{`Update personal information`}
				</Text>
				<Text
					textAlign={'center'}
					color={'dark_lighter'}
					className={'animate__animated animate__fadeInUp'}
				>
					{`Let you're potential match know more about you`}
				</Text>
				<VStack mt={'60px'} w={'full'} spacing={DEFAULT_PADDING}>
					<Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={2}
						>
							<Text as='label' htmlFor='occupation' color={'text_muted'} fontSize={'sm'}>
								Occupation
							</Text>
							<Input
								id='occupation'
								required
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
								Employment Status
							</Text>
							<Select placeholder='Select option' bg='dark' required>
								<option value='employed'>Employed</option>
								<option value='unemployed'>Unemployed</option>
								<option value='self employed'>Self employed</option>
								<option value='student'>Student</option>
								<option value='corps member'>{`Corps member (NYSC)`}</option>
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
								Work Industry
							</Text>
							<Select placeholder='Select option' bg='dark' required>
								{industries.map((industry) => (
									<option key={industry} value={industry.toLowerCase()}>
										{industry}
									</option>
								))}
							</Select>
						</Flex>
						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={2}
						>
							<Text color={'text_muted'} fontSize={'sm'}>
								Religion
							</Text>
							<Select placeholder='Select option' bg='dark' required>
								<option value='christian'>Christian</option>
								<option value='muslim'>Muslim</option>
								<option value='others'>Others</option>
							</Select>
						</Flex>
					</Flex>
					<Divider my={DEFAULT_PADDING} />
					<Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={2}
						>
							<Text color={'text_muted'} fontSize={'sm'}>
								Tiktok Username
							</Text>
							<InputGroup>
								<InputLeftAddon bg='dark' border='1px' borderColor={'dark_light'}>tiktok.com/</InputLeftAddon>
								<Input type='text' placeholder='@johndoe' />
							</InputGroup>
						</Flex>
						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={2}
						>
							<Text color={'text_muted'} fontSize={'sm'}>
								Facebook Username
							</Text>
							<InputGroup>
								<InputLeftAddon bg='dark' border='1px' borderColor={'dark_light'}>facebook.com/</InputLeftAddon>
								<Input type='text' placeholder='johndoe' />
							</InputGroup>
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
								Instagram Username
							</Text>
							<InputGroup>
								<InputLeftAddon bg='dark' border='1px' borderColor={'dark_light'}>instagram.com/</InputLeftAddon>
								<Input type='text' placeholder='johndoe' required />
							</InputGroup>
						</Flex>
						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={2}
						>
							<Text color={'text_muted'} fontSize={'sm'}>
								Twitter Username
							</Text>
							<InputGroup>
								<InputLeftAddon bg='dark' border='1px' borderColor={'dark_light'}>x.com/</InputLeftAddon>
								<Input type='text' placeholder='ohndoe' />
							</InputGroup>
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
								Linkedin URL
							</Text>
							<Input
								required
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Ex. https://www.linkedin.com/in/xyz"
							/>
						</Flex>
					</Flex>
					<br />
					<Button type={'submit'} isLoading={isLoading}>{`Next`}</Button>
				</VStack>
			</Flex>
		</>
	)
}
