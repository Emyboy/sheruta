import MainContainer from '@/components/layout/MainContainer'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import MainLeftNav from '@/components/layout/MainLeftNav'
import MainPostOptions from '@/components/atoms/MainPostOptions'
import { DEFAULT_PADDING } from '@/configs/theme'
import MainHeader from '@/components/layout/MainHeader'
import axiosInstance from '@/utils/custom-axios'

type Props = {}

export default async function page({}: Props) {

	const { data } = await axiosInstance.get(`/users/dependencies`)

	//data.options

	//data.user_data

	console.log("User dependencies", JSON.stringify(data.options))

	
	return (
		<Flex justifyContent={'center'}>
			<MainContainer>
				<ThreeColumnLayout header={<MainHeader />}>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>
					<Box p={DEFAULT_PADDING}>
						<MainPostOptions />
					</Box>
				</ThreeColumnLayout>
			</MainContainer>
		</Flex>
	)
}
