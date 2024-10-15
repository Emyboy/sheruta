'use client'

import { DEFAULT_PADDING } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
import { useOptionsContext } from '@/context/options.context'
import useAuthenticatedAxios from '@/hooks/useAxios'
import useCommon from '@/hooks/useCommon'
import {
	Button,
	Divider,
	Flex,
	Input,
	InputGroup,
	InputLeftAddon,
	Select,
	Text,
	VStack,
} from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

type Props = {
	done: () => void
}

export default function PersonalInfoForm({ done }: Props) {

	const { showToast } = useCommon()

	const {
		authState: { user, user_info, flat_share_profile },
		setAuthState,
	} = useAuthContext()
	const {
		optionsState: { work_industries },
	} = useOptionsContext()

	const axiosInstance = useAuthenticatedAxios()

	const [isLoading, setIsLoading] = useState(false)

	const [occupation, setOccupation] = useState(
		flat_share_profile?.occupation || '',
	)
	const [employment_status, setEmploymentStatus] = useState(
		flat_share_profile?.employment_status || '',
	)
	const [work_industry, setWorkIndustry] = useState(
		flat_share_profile?.work_industry || '',
	)
	const [religion, setReligion] = useState(flat_share_profile?.religion || '')
	const [gender_preference, setGenderPreference] = useState(
		flat_share_profile?.gender_preference || '',
	)

	const [age_preference, setAgePreference] = useState(
		flat_share_profile?.age_preference || '',
	)

	const [tiktok, setTiktok] = useState(flat_share_profile?.tiktok || '')
	const [facebook, setFacebook] = useState(flat_share_profile?.facebook || '')
	const [instagram, setInstagram] = useState(
		flat_share_profile?.instagram || '',
	)
	const [twitter, setTwitter] = useState(flat_share_profile?.twitter || '')
	const [linkedin, setLinkedin] = useState(flat_share_profile?.linkedin || '')

	const { mutate } = useMutation({
		mutationFn: async () => {
			if (user) {
				setIsLoading(true)
				await Promise.all([
					axiosInstance.put('/flat-share-profile', {
						occupation,
						employment_status,
						work_industry,
						religion,
						tiktok,
						facebook,
						instagram,
						twitter,
						linkedin,
						gender_preference,
						age_preference: {
							min: age_preference.split(' ')[0],
							max: age_preference.split(' ')[2],
						},
					}),

					axiosInstance.post('/user-info/kyc/complete'),
				])
			}
		},
		onSuccess: () => {
			setAuthState({
				// @ts-ignore
				flat_share_profile: {
					...flat_share_profile,
					occupation,
					employment_status,
					work_industry,
					religion,
					tiktok,
					facebook,
					instagram,
					twitter,
					linkedin,
					gender_preference,
					age_preference,
					done_kyc: true,
				},
			})

			setIsLoading(false)
			done()
		},
		onError: (err) => {
			setIsLoading(false)
			console.error(err)
			showToast({
				message: 'Error, please try again',
				status: 'error',
			})
		},
	})

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
				<form
					onSubmit={(e) => {
						e.preventDefault()
						mutate()
					}}
				>
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
									value={occupation}
									required
									borderColor={'border_color'}
									_dark={{ borderColor: 'dark_light' }}
									placeholder="Ex. Banker"
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
									value={employment_status}
								>
									<option value={''}>None</option>
									<option value="employed">Employed</option>
									<option value="unemployed">Unemployed</option>
									<option value="self_employed">Self employed</option>
									<option value="student">Student</option>
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
									value={work_industry}
								>
									{work_industries.map((industry: any) => (
										<option key={industry._id} value={industry._id}>
											{industry.name}
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
									value={religion}
								>
									<option value="christian">Christian</option>
									<option value="muslim">Muslim</option>
									<option value="traditional">Traditional</option>
									<option value="atheist">Atheist</option>
									<option value="other">Others</option>
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
									Gender preference
								</Text>
								<Select
									placeholder="Select option"
									bg="dark"
									required
									onChange={(e) => setGenderPreference(e.target.value)}
									value={gender_preference}
								>
									<option value="male">Male only</option>
									<option value="female">Female only</option>
								</Select>
							</Flex>
							<Flex
								justifyContent={'flex-start'}
								flexDir={'column'}
								w="full"
								gap={2}
							>
								<Text color={'text_muted'} fontSize={'sm'}>
									Age preference
								</Text>
								<Select
									placeholder="Select option"
									bg="dark"
									required
									onChange={(e) => setAgePreference(e.target.value)}
									value={age_preference}
								>
									<option value="18 - 23">18 - 23 yrs</option>
									<option value="24 - 29">24 - 29 yrs</option>
									<option value="30 - 35">30 - 35 yrs</option>
									<option value="35 - 1000">Above 35 yrs</option>
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
										value={tiktok}
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
										value={facebook}
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
										value={instagram}
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
										value={twitter}
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
									borderColor={'border_color'}
									_dark={{ borderColor: 'dark_light' }}
									placeholder="Ex. https://www.linkedin.com/in/xyz"
									onChange={(e) => setLinkedin(e.target.value)}
									value={linkedin}
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
