'use client'
import { DEFAULT_PADDING } from '@/configs/theme'
import { useAppContext } from '@/context/app.context'
import { useAuthContext } from '@/context/auth.context'
import { Box, Button, Flex, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FaCoins } from 'react-icons/fa'
import { CreditOptions } from '../popups/CreditOptionsPopups'

type Props = {
	credit: number
}

export default function CreditInfo({ credit }: Props) {
	const { authState } = useAuthContext()
	const [ready, setReady] = useState(false)
	
	if (
		authState.flat_share_profile &&
		Number(authState.flat_share_profile?.credits) < credit
	) {
		if (ready) {
			return (
				<Box p={DEFAULT_PADDING}>
					<CreditOptions />
				</Box>
			)
		}
		return (
			<>
				<Flex justifyContent={'center'} alignItems={'center'} w="full">
					<Flex
						maxW={`calc(100% - ${DEFAULT_PADDING})`}
						minW={'300px'}
						p={DEFAULT_PADDING}
						border={'1px'}
						borderColor={'border_color'}
						_dark={{
							borderColor: 'dark_light',
						}}
						h="full"
						rounded={'md'}
						my={DEFAULT_PADDING}
						flexDir={'column'}
						justifyContent={'space-between'}
					>
						<Text>You do not have enough credits of {credit}</Text>
						<Button onClick={() => setReady(true)}>Buy Credit</Button>
					</Flex>
				</Flex>
			</>
		)
	}

	return (
		<Flex justifyContent={'center'} alignItems={'center'} w="full">
			<Flex
				maxW={`calc(100% - ${DEFAULT_PADDING})`}
				minW={'300px'}
				p={DEFAULT_PADDING}
				border={'1px'}
				borderColor={'border_color'}
				_dark={{
					borderColor: 'dark_light',
				}}
				h="full"
				rounded={'md'}
				my={DEFAULT_PADDING}
				flexDir={'column'}
				justifyContent={'space-between'}
			>
				<Flex
					alignItems={'center'}
					fontSize={'xx-large'}
					fontWeight={'bold'}
					gap={2}
				>
					<FaCoins color="gold" /> {credit} credits required
				</Flex>
				<Button>
					Use
					<Flex alignItems={'center'} gap={1} ml={4}>
						<FaCoins color="gold" /> {credit}
					</Flex>
				</Button>
			</Flex>
		</Flex>
	)
}
