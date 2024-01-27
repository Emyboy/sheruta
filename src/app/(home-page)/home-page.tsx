'use client'
import EachRequest from '@/components/EachRequest/EachRequest'
import MainHeader from '@/components/layout/MainHeader'
import MainLeftNav from '@/components/layout/MainLeftNav'
import MainPageBody from '@/components/layout/MainPageBody'
import MainRightNav from '@/components/layout/MainRightNav'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { DEFAULT_PADDING } from '@/configs/theme'
import { useAppContext } from '@/context/app.context'
import { useAuthContext } from '@/context/auth.context'
import { Button, Flex, Text } from '@chakra-ui/react'
import React from 'react'

type Props = {}

export default function HomePage({}: Props) {
	const { setAppState } = useAppContext()
	const { authState } = useAuthContext()

	return (
		<>
			<MainPageBody>
				<ThreeColumnLayout header={<MainHeader />}>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>
					<Flex flexDirection={'column'} gap={0} px={DEFAULT_PADDING}>
						{!authState?.user && (
							<Flex
								justifyContent={'center'}
								alignItems={'center'}
								flexDir={'column'}
								h="200px"
								gap={DEFAULT_PADDING}
								backgroundImage={`url(https://i.pinimg.com/564x/c3/99/ff/c399fffc5137b34474d82bee0fb9fc61.jpg)`}
								backgroundPosition={'center'}
								my={DEFAULT_PADDING}
								rounded={'lg'}
							>
								<Text fontWeight={'bold'} fontSize={'xx-large'}>
									Join the community
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
						)}
						{new Array(9).fill(null).map((_) => {
							return <EachRequest key={Math.random()} />
						})}
					</Flex>
					<Flex>
						<MainRightNav />
					</Flex>
				</ThreeColumnLayout>
			</MainPageBody>
		</>
	)
}
