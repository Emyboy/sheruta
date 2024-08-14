import MainPageBody from '@/components/layout/MainPageBody'
import MainHeader from '@/components/layout/MainHeader'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { Flex } from '@chakra-ui/react'
import moment from 'moment/moment'
import MainBackHeader from '@/components/atoms/MainBackHeader'
import React from 'react'

export default function page() {
	return (
		<>
			<MainPageBody>
				<ThreeColumnLayout
					header={
						<MainBackHeader
							backRoute={'/groups'}
							heading={'Group details'}
							subHeading={'the sub heading'}
						/>
					}
				>
					<Flex flexDirection={'column'} w="full"></Flex>
					<Flex flexDir={'column'}></Flex>
					<Flex></Flex>
				</ThreeColumnLayout>
			</MainPageBody>
		</>
	)
}
