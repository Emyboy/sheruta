import EachRequest from '@/components/EachRequest/EachRequest'
import MainContainer from '@/components/layout/MainContainer'
import MainHeader from '@/components/layout/MainHeader'
import MainLeftNav from '@/components/layout/MainLeftNav'
import MainPageBody from '@/components/layout/MainPageBody'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { Box, Flex, VStack } from '@chakra-ui/react'
import React from 'react'

type Props = {}

export default function HomePage({}: Props) {
	return (
		<>
			<MainHeader />
			<MainPageBody>
				<ThreeColumnLayout>
					<VStack>
						<MainLeftNav />
					</VStack>
					<VStack bg="background" gap={0}>
						{new Array(25).fill(null).map((_) => {
							return <EachRequest key={Math.random()} />
						})}
					</VStack>
					<VStack pt={5}></VStack>
				</ThreeColumnLayout>
			</MainPageBody>
		</>
	)
}
