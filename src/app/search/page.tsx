import MainContainer from '@/components/layout/MainContainer'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { Flex } from '@chakra-ui/react'
import React from 'react'
import SearchPage from './search-page'
import MainHeader from '@/components/layout/MainHeader'
import SearchPageFilter from './(components)/SearchPageFilter'

type Props = {}
export const dynamic = 'force-dynamic'
export default function page({}: Props) {
	return (
		<Flex justifyContent={'center'}>
			{/* <MainContainer>
				<ThreeColumnLayout header={<MainHeader />}>
					<Flex flexDirection={'column'} w="full">
						<SearchPageFilter />
					</Flex>
					<SearchPage />
				</ThreeColumnLayout>
			</MainContainer> */}
		</Flex>
	)
}
