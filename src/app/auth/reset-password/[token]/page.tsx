import MainContainer from '@/components/layout/MainContainer'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import MainLeftNav from '@/components/layout/MainLeftNav'
import { DEFAULT_PADDING } from '@/configs/theme'
import MainHeader from '@/components/layout/MainHeader'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'

type Props = {
	params: { token: string }
}

export default function page({ params: { token } }: Props) {
	return (
		<Flex justifyContent={'center'}>
			<MainContainer>
				<ThreeColumnLayout header={<MainHeader />}>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>
					<Box p={DEFAULT_PADDING}>
						<ResetPasswordForm token={token} />
					</Box>
				</ThreeColumnLayout>
			</MainContainer>
		</Flex>
	)
}
