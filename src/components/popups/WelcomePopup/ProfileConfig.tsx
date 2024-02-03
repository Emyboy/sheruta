import { DEFAULT_PADDING } from '@/configs/theme'
import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import React, { useState } from 'react'
import { BiSolidCheckCircle } from 'react-icons/bi'

type Props = {
	next: () => void
}

export default function ProfileConfig({ next }: Props) {
	const [seeking, setSeeking] = useState<null | boolean>(null)
	return (
		<VStack py={DEFAULT_PADDING} spacing={10}>
			<VStack>
				<Text fontSize={'xl'} fontWeight={'bold'}>
					What are you looking for?
				</Text>
			</VStack>
			<Flex w="full" justifyContent={'space-between'} gap={5}>
				<EachConfig
					onClick={() => setSeeking(false)}
					active={seeking === false}
					heading="Host"
					img_url="/assets/ai/11.jpeg"
				/>
				<EachConfig
					onClick={() => setSeeking(true)}
					active={seeking === true}
					heading="Guest"
					img_url="/assets/ai/22.jpeg"
				/>
			</Flex>
			<Button
				isDisabled={seeking === null}
				bg="brand"
				w="full"
				colorScheme=""
				onClick={next}
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
}: {
	img_url: string
	active: boolean
	heading: string
	onClick: () => void
}) => {
	return (
		<Flex
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
			<Text color={active ? 'white' : 'dark_lighter'} fontSize={'xl'} fontWeight={'bold'}>
				{heading}
			</Text>
			<Text textAlign={'center'} color={active ? 'white' : 'dark_lighter'} fontSize={'md'}>
				I have to do it the way you want it.
			</Text>
		</Flex>
	)
}
