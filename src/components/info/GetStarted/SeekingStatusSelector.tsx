import { useAuthContext } from '@/context/auth.context'
import useAuthenticatedAxios from '@/hooks/useAxios'
import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import Image from 'next/image'
import { useState } from 'react'
import { BiSolidCheckCircle } from 'react-icons/bi'

export default function SeekingStatusSelector({ done }: { done?: () => void }) {
	const {
		authState: { user, flat_share_profile },
		getAuthDependencies,
		setAuthState,
	} = useAuthContext()

	const axiosInstance = useAuthenticatedAxios()

	const [seeking, setSeeking] = useState<boolean | null>(
		flat_share_profile?.seeking || null,
	)
	const [isLoading, setIsLoading] = useState(false)

	const { mutate } = useMutation({
		mutationFn: async () => {
			if (user) {
				setIsLoading(true)
				await axiosInstance.put('/flat-share-profile', {
					seeking,
				})
			}
		},
		onSuccess: () => {
			// @ts-ignore
			setAuthState({ flat_share_profile: { ...flat_share_profile, seeking } })
			setIsLoading(false)
			if (done) {
				done()
			}
		},
		onError: () => setIsLoading(false),
	})

	return (
		<Flex flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
			<Text textAlign={'center'} as={'h1'} fontSize={'3xl'}>
				{`What brings you to Sheruta?`}
			</Text>
			<Text textAlign={'center'} color={'dark_lighter'}>
				{`Select one for a personalized experience`}
			</Text>
			<Flex flexDir={{ md: 'row', base: 'column' }} gap={`30px`} py={10}>
				<EachConfig
					subHeading={`I'm looking for a flat`}
					onClick={() => setSeeking(true)}
					active={seeking === true}
					heading="Seeker"
					img_url="/assets/ai/11.jpeg"
				/>
				<EachConfig
					subHeading={`I have a flat to share`}
					onClick={() => setSeeking(false)}
					active={seeking === false}
					heading="Host"
					img_url="/assets/ai/12.jpeg"
				/>
			</Flex>
			<br />
			<Button
				onClick={() => mutate()}
				isDisabled={seeking === null}
				isLoading={isLoading}
			>{`Next`}</Button>
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
