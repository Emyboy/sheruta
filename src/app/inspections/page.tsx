import MainContainer from '@/components/layout/MainContainer'
import MainHeader from '@/components/layout/MainHeader'
import MainLeftNav from '@/components/layout/MainLeftNav'
import MobileNavFooter from '@/components/layout/MobileNavFooter'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { Flex } from '@chakra-ui/react'
import MyInspections from './MyInspections'

export default async function page({}) {
	return (
		<Flex justifyContent={'center'}>
			<MainContainer>
				<ThreeColumnLayout header={<MainHeader />}>
					<MainLeftNav />
					<MyInspections />
				</ThreeColumnLayout>
				<MobileNavFooter />
			</MainContainer>
		</Flex>
	)
}
