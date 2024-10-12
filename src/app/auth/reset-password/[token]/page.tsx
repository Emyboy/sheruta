import { Flex } from '@chakra-ui/react'
import React from 'react'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'

type Props = {
	params: { token: string }
}

export default function page({ params: { token } }: Props) {
	return (
		<Flex
			bg={'dark_light'}
			_dark={{ bg: 'dark' }}
			position={'fixed'}
			top={0}
			bottom={0}
			left={0}
			right={0}
			zIndex={500}
			flexDir={'column'}
			justifyContent={'center'}
			alignItems={'center'}
			overflowY={'auto'}
		>
			<ResetPasswordForm token={token} />
		</Flex>
	)
}
