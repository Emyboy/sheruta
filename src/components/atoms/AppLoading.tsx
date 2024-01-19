import { useAppContext } from '@/context/app.context'
import { Flex, Spinner } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

type Props = {}

export default function AppLoading({}: Props) {
	const { appState } = useAppContext()
	const { app_loading } = appState

	if (!app_loading) {
		return null
	}

	return (
		<Flex
			zIndex={300}
			bg="white"
			_dark={{
				bg: 'dark',
			}}
			position={'fixed'}
			top={0}
			bottom={0}
			maxH={'100vh'}
			left={0}
			right={0}
			justifyContent={'center'}
			alignItems={'center'}
		>
			<Flex flexDir={'column'} alignItems={'center'} gap={7}>
				<Image src="/icon_green.png" alt="brand" width={80} height={80} />
				<Spinner color="dark_lighter" size="sm" />
			</Flex>
		</Flex>
	)
}
