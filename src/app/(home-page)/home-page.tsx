import MainHeader from '@/components/layout/MainHeader'
import MainLeftNav from '@/components/layout/MainLeftNav'
import MainPageBody from '@/components/layout/MainPageBody'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { Box, VStack } from '@chakra-ui/react'
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
					<VStack pt={5}>
						{new Array(20).fill(null).map((_) => {
							return (
								<Box
									mb="30px"
									p="20px"
									bg="white"
									key={Math.random()}
									width={'full'}
								>
									<div>HomePage</div>
								</Box>
							)
						})}
					</VStack>
					<VStack pt={5}></VStack>
				</ThreeColumnLayout>
			</MainPageBody>
		</>
	)
}
