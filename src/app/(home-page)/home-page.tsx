import EachRequest from '@/components/EachRequest/EachRequest'
import MainHeader from '@/components/layout/MainHeader'
import MainLeftNav from '@/components/layout/MainLeftNav'
import MainPageBody from '@/components/layout/MainPageBody'
import MainRightNav from '@/components/layout/MainRightNav'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { DEFAULT_PADDING } from '@/configs/theme'
import { Flex } from '@chakra-ui/react'
import React from 'react'

type Props = {}

export default function HomePage({}: Props) {
	return (
		<>
			<MainPageBody>
				<ThreeColumnLayout header={<MainHeader />}>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>
					<Flex flexDirection={'column'} gap={0} px={DEFAULT_PADDING}>
						{new Array(9).fill(null).map((_) => {
							return <EachRequest key={Math.random()} />
						})}
					</Flex>
					<Flex>
						<MainRightNav />
					</Flex>
				</ThreeColumnLayout>
			</MainPageBody>
		</>
	)
}
