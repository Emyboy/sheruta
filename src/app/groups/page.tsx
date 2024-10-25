import MainBackHeader from '@/components/atoms/MainBackHeader'
import MainPageBody from '@/components/layout/MainPageBody'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { Flex } from '@chakra-ui/react'

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
