import { NAV_HEIGHT } from '@/configs/theme'
import { Button, Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function PageNotFound() {
	const router = useRouter()

	return (
		<Flex
			minH={`calc(90vh - ${NAV_HEIGHT})`}
			flexDirection={'column'}
			justifyContent={'center'}
			alignItems={'center'}
		>
			<Text fontSize={'100px'}>404</Text>
			<Text>Page Not Found</Text>
			<Flex gap={2} alignItems={'center'} justifyContent={'center'} mt={2}>
				<Button bg={'dark'} color={'white'} onClick={() => router.back()}>
					Go Back
				</Button>
				<Button bg={'brand'} color={'white'} onClick={() => router.push('/')}>
					Home
				</Button>
			</Flex>
		</Flex>
	)
}
