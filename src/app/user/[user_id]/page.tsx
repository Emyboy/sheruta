import React from 'react'
import UserProfilePage from './(user-profile)/UserProfilePage'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import MainContainer from '@/components/layout/MainContainer'
import { Flex } from '@chakra-ui/react'
import MainLeftNav from '@/components/layout/MainLeftNav'
import MainBackHeader from '@/components/atoms/MainBackHeader'
import AuthService from '@/firebase/service/auth/auth.firebase'
import PageNotFound from '@/components/PageNotFound'
import { apiCall } from '@/utils/api.utils'

export default async function page(props: any) {
	const { params } = props
	const { user_id } = params

	let user = await apiCall({
		route: '/getProfile',
		options: {
			data: { user_id },
		},
	})
	console.log('DATA::', user.data)
	// console.log('DATA::', user)

	return (
		<Flex justifyContent={'center'}>
			<MainContainer>
				<ThreeColumnLayout header={<MainBackHeader />}>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>
					{user ? <UserProfilePage data={user.data} /> : <PageNotFound />}
				</ThreeColumnLayout>
			</MainContainer>
		</Flex>
	)
}
