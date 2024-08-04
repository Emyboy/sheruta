'use client'
import { DEFAULT_PADDING } from '@/configs/theme'
import {
	Button,
	Divider,
	Flex,
	Input,
	InputGroup,
	InputLeftAddon,
	Text,
	VStack,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { Select } from '@chakra-ui/react'
import { industries } from '@/constants'
import useCommon from '@/hooks/useCommon'
import FlatShareProfileService from '@/firebase/service/flat-share-profile/flat-share-profile.firebase'
import { useAuthContext } from '@/context/auth.context'

type Props = {
	done?: () => void
}

export default function PersonalInfoForm({}: Props) {
	const { showToast } = useCommon();
	const { getAuthDependencies } = useAuthContext();
	const {
		authState: { user, flat_share_profile },
	} = useAuthContext()
	const [isLoading, setIsLoading] = useState(false)
	const [occupation, setOccupation] = useState('')
	const [employment_status, setEmploymentStatus] = useState('')
	const [work_industry, setWorkIndustry] = useState('')
	const [religion, setReligion] = useState('')
	const [tiktok, setTiktok] = useState('')
	const [facebook, setFacebook] = useState('')
	const [instagram, setInstagram] = useState('')
	const [twitter, setTwitter] = useState('')
	const [linkedin, setLinkedin] = useState('')

	const handleSubmit = async (e: any) => {
		e.preventDefault()
		try {
			setIsLoading(true)
			await FlatShareProfileService.update({
				document_id: user?._id as string,
				data: {
					occupation,
					employment_status,
					work_industry,
					religion,
					tiktok,
					facebook,
					instagram,
					twitter,
					linkedin,
				},
			})
			await  getAuthDependencies();
			setIsLoading(false)
		} catch (error) {
			showToast({
				message: 'Error, please try again',
				status: 'error',
			})
		}
		setIsLoading(false)
	}

	return (
		<>
			<Flex
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
				<form onSubmit={handleSubmit}>
					<VStack mt={'60px'} w={'full'} spacing={DEFAULT_PADDING}>
						<Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
							<Flex
								justifyContent={'flex-start'}
								flexDir={'column'}
								w="full"
								gap={2}
							>
								<Text
									as="label"
									htmlFor="occupation"
									color={'text_muted'}
									fontSize={'sm'}
								>
									Occupation
								</Text>
								<Input
									id="occupation"
									value={flat_share_profile?.occupation || ''}
									required
									borderColor={'border_color'}
									_dark={{ borderColor: 'dark_light' }}
									placeholder="Ex. Jane"
									onChange={(e) => setOccupation(e.target.value)}
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
								<Select
									placeholder="Select option"
									bg="dark"
									required
									onChange={(e) => setEmploymentStatus(e.target.value)}
									value={
										flat_share_profile?.employment_status?.toLowerCase() || ''
									}
								>
									<option value="employed">Employed</option>
									<option value="unemployed">Unemployed</option>
									<option value="self employed">Self employed</option>
									<option value="student">Student</option>
									<option value="corps member">{`Corps member (NYSC)`}</option>
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
								<Select
									placeholder="Select option"
									bg="dark"
									required
									onChange={(e) => setWorkIndustry(e.target.value)}
									value={flat_share_profile?.work_industry?.toLowerCase() || ''}
								>
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
								<Select
									placeholder="Select option"
									bg="dark"
									required
									onChange={(e) => setReligion(e.target.value)}
									value={flat_share_profile?.religion || ''}
								>
									<option value="christian">Christian</option>
									<option value="muslim">Muslim</option>
									<option value="others">Others</option>
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
									<InputLeftAddon
										bg="dark"
										border="1px"
										borderColor={'dark_light'}
									>
										tiktok.com/
									</InputLeftAddon>
									<Input
										type="text"
										placeholder="@johndoe"
										onChange={(e) => setTiktok(e.target.value)}
										value={flat_share_profile?.tiktok || ''}
									/>
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
									<InputLeftAddon
										bg="dark"
										border="1px"
										borderColor={'dark_light'}
									>
										facebook.com/
									</InputLeftAddon>
									<Input
										type="text"
										placeholder="johndoe"
										onChange={(e) => setFacebook(e.target.value)}
										value={flat_share_profile?.facebook || ''}
									/>
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
									<InputLeftAddon
										bg="dark"
										border="1px"
										borderColor={'dark_light'}
									>
										instagram.com/
									</InputLeftAddon>
									<Input
										type="text"
										placeholder="johndoe"
										required
										onChange={(e) => setInstagram(e.target.value)}
										value={flat_share_profile?.instagram || ''}
									/>
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
									<InputLeftAddon
										bg="dark"
										border="1px"
										borderColor={'dark_light'}
									>
										x.com/
									</InputLeftAddon>
									<Input
										type="text"
										placeholder="ohndoe"
										onChange={(e) => setTwitter(e.target.value)}
										value={flat_share_profile?.twitter || ''}
									/>
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
									onChange={(e) => setLinkedin(e.target.value)}
									value={flat_share_profile?.linkedin || ''}
								/>
							</Flex>
						</Flex>
						<br />
						<Button type={'submit'} isLoading={isLoading}>{`Next`}</Button>
					</VStack>
				</form>
			</Flex>
		</>
	)
}
