import MainContainer from '@/components/layout/MainContainer'
import MainHeader from '@/components/layout/MainHeader'
import MainLeftNav from '@/components/layout/MainLeftNav'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { Flex } from '@chakra-ui/react'
import React from 'react'

type Props = {}

export default function page({}: Props) {
	return <Flex justifyContent={'center'}>
		<MainContainer>
			<ThreeColumnLayout header={<MainHeader />}>
				<Flex flexDirection={'column'} w="full">
					<MainLeftNav />
				</Flex>
				<h1>Matches Page</h1>
			</ThreeColumnLayout>
		</MainContainer>
	</Flex>
}
