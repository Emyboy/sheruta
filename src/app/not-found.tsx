'use client'

import MainHeader from '@/components/layout/MainHeader'
import MainLeftNav from '@/components/layout/MainLeftNav'
import MainPageBody from '@/components/layout/MainPageBody'
import MainRightNav from '@/components/layout/MainRightNav'
import MobileNavFooter from '@/components/layout/MobileNavFooter'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import PageNotFound from '@/components/PageNotFound'
import { Flex } from '@chakra-ui/react'

export default function NotFound() {
	return (
		<MainPageBody>
			<ThreeColumnLayout header={<MainHeader />}>
				<Flex flexDirection={'column'} w="full">
					<MainLeftNav />
				</Flex>
				<Flex flexDir={'column'}>
					<PageNotFound />
				</Flex>
				<Flex>
					<MainRightNav />
				</Flex>
			</ThreeColumnLayout>
			<MobileNavFooter />
		</MainPageBody>
	)
}
