import { DEFAULT_PADDING } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
import FlatShareProfileService from '@/firebase/service/flat-share-profile/flat-share-profile.firebase'
import useCommon from '@/hooks/useApp'
import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import React, { useState } from 'react'
import { BiSolidCheckCircle } from 'react-icons/bi'

type Props = {
	next: () => void
}

export default function ProfileConfig({ next }: Props) {
	const { authState, setAuthState } = useAuthContext();
	const { user } = authState;
	const [seeking, setSeeking] = useState<null | boolean>(null);
	const { CommonState: { loading }, setCommonState } = useCommon();

	const handleUpdate = async () => {
		try {
			setCommonState({ loading: true })
			let result = await FlatShareProfileService.update({
				data: {
					seeking
				},
				document_id: user?._id as string
			});
			
			setAuthState({ flat_share_profile: result })
			setCommonState({ loading: false })
			next();
		} catch (error) {
			setCommonState({ loading: false })
		}
	}

	return (
		<VStack p={DEFAULT_PADDING} spacing={10}>
			<VStack>
				<Text fontSize={'xl'} fontWeight={'bold'}>
					What are you looking for?
				</Text>
			</VStack>
			<Flex w="full" justifyContent={'space-around'} gap={20}>
				<EachConfig
					subHeading={`Choose if you're an apartment or space provider.`}
					onClick={() => setSeeking(false)}
					active={seeking === false}
					heading="Host"
					img_url="/assets/ai/11.jpeg"
				/>
				<EachConfig
					subHeading={`Choose if you are an apartment or space seeker.`}
					onClick={() => setSeeking(true)}
					active={seeking === true}
					heading="Seeker"
					img_url="/assets/ai/22.jpeg"
				/>
			</Flex>
			<Button
				isLoading={loading}
				isDisabled={seeking === null}
				bg="brand"
				w="full"
				colorScheme=""
				onClick={handleUpdate}
			>
				Continue
			</Button>
		</VStack>
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
					h={20}
					w={20}
					position={'relative'}
					overflow={'hidden'}
					rounded={'full'}
				>
					<Image src={img_url} alt="config" fill />
				</Box>
				{active && (
					<Flex
						h={7}
						w={7}
						rounded={'full'}
						bg="brand"
						color="white"
						position={'absolute'}
						alignItems={'center'}
						justifyContent={'center'}
						right={0}
						bottom={2}
					>
						<BiSolidCheckCircle size={25} />
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
