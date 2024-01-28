'use client'
import { DEFAULT_PADDING } from '@/configs/theme'
import { useAppContext } from '@/context/app.context'
import { useAuthContext } from '@/context/auth.context'
import { getRandomNumber } from '@/utils/index.utils'
import { Button, Flex, Text } from '@chakra-ui/react'
import React from 'react'

type Props = {}

export default function JoinTheCommunity({}: Props) {
	const { setAppState } = useAppContext()
	const { authState } = useAuthContext()
	return (
		<>
			{!authState?.user && (
				<Flex
					justifyContent={'center'}
					h="250px"
					gap={DEFAULT_PADDING}
					backgroundImage={`url('/assets/pintrest/${getRandomNumber(1, 10)}.jpg')`}
					backgroundPosition={'center'}
					backgroundSize={'cover'}
					mb={DEFAULT_PADDING}
					position={'relative'}
					overflow={'hidden'}
				>
					<Flex
						zIndex={10}
						justifyContent={'center'}
						alignItems={'center'}
						flexDir={'column'}
					>
						<Text fontWeight={'bold'} fontSize={'xx-large'}>
							Join the community today
						</Text>
						<Button
							colorScheme=""
							px={30}
							bg="dark"
							onClick={() => setAppState({ show_login: true })}
						>
							Login
						</Button>
					</Flex>
					<Flex
						position={'absolute'}
						h="110%"
						w="110%"
						className="overlay"
						zIndex={0}
					/>
				</Flex>
			)}
		</>
	)
}
