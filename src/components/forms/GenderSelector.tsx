import { Box, Button, Flex, Text } from '@chakra-ui/react'
import Image from 'next/image'
import React, { useState } from 'react'
import { BiSolidCheckCircle } from 'react-icons/bi'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import { useAuthContext } from '@/context/auth.context'
import { saveProfileDocs } from '@/firebase/service/userProfile/user-profile'
import useAuthenticatedAxios from '@/hooks/useAxios'
import { useMutation } from '@tanstack/react-query'

export default function GenderSelect({ done }: { done?: () => void }) {
	const {
		authState: { user, user_info },
		getAuthDependencies,
		setAuthState,
	} = useAuthContext()

	const axiosInstance = useAuthenticatedAxios()

	const [gender, setGender] = useState<'male' | 'female' | null>(
		user_info?.gender || null,
	)
	const [isLoading, setIsLoading] = useState(false)

	const { mutate } = useMutation({
		mutationFn: async () => {
			if (user) {
				setIsLoading(true)
				await axiosInstance.put('/user-info', {
					gender,
				})
			}
		},
		onSuccess: (data) => {
			console.log(data)
			// @ts-ignore
			setAuthState({ user_info: { ...user_info, gender } })
			setIsLoading(false)
			if (done) {
				done()
			}
		},
		onError: (err) => {
			console.log(err)
			setIsLoading(false)
		},
	})

	const update = async () => {
		if (gender && user) {
			setIsLoading(true)
			await UserInfoService.update({
				data: { gender },
				document_id: user?._id,
			})
			await saveProfileDocs({ gender }, user?._id)
			await getAuthDependencies()
			setIsLoading(false)
			if (done) {
				done()
			}
		}
	}

	return (
		<Flex flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
			<Text textAlign={'center'} as={'h1'} fontSize={'3xl'}>
				{`What's your gender?`}
			</Text>
			<Text textAlign={'center'} color={'dark_lighter'}>
				{`Help our matching algorithm find the best match`}
			</Text>
			<Flex flexDir={{ md: 'row', base: 'column' }} gap={`30px`} py={10}>
				<EachConfig
					subHeading={``}
					onClick={() => setGender('male')}
					active={gender === 'male'}
					heading="Male"
					img_url="/assets/ai/44.jpeg"
				/>
				<EachConfig
					subHeading={``}
					onClick={() => setGender('female')}
					active={gender === 'female'}
					heading="Female"
					img_url="/assets/ai/22.jpeg"
				/>
			</Flex>
			<br />
			<Button onClick={() => mutate()} isLoading={isLoading}>{`Next`}</Button>
		</Flex>
	)
}

const EachConfig = ({
	img_url,
	active,
	heading,
	onClick,
	subHeading,
}: {
	img_url: string
	active: boolean
	heading: string
	onClick: () => void
	subHeading: string
}) => {
	return (
		<Flex
			cursor={'pointer'}
			userSelect={'none'}
			onClick={onClick}
			justifyContent={'center'}
			alignItems={'center'}
			flexDirection={'column'}
		>
			<Box
				bg={active ? 'brand' : 'dark_light'}
				p="3px"
				rounded={'full'}
				position={'relative'}
				mb={1}
			>
				<Box
					h={'130px'}
					w={'130px'}
					position={'relative'}
					overflow={'hidden'}
					rounded={'full'}
				>
					<Image src={img_url} alt="config" fill />
				</Box>
				{active && (
					<Flex
						h={10}
						w={10}
						rounded={'full'}
						bg="brand"
						color="white"
						position={'absolute'}
						alignItems={'center'}
						justifyContent={'center'}
						right={0}
						bottom={2}
					>
						<BiSolidCheckCircle size={35} />
					</Flex>
				)}
			</Box>
			<Text
				color={active ? 'white' : 'dark_lighter'}
				fontSize={'xl'}
				fontWeight={'bold'}
			>
				{heading}
			</Text>
			<Text
				textAlign={'center'}
				color={active ? 'white' : 'dark_lighter'}
				fontSize={'sm'}
			>
				{subHeading}
			</Text>
		</Flex>
	)
}
