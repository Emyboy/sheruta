import MainContainer from '@/components/layout/MainContainer'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import MainLeftNav from '@/components/layout/MainLeftNav'
import MainPostOptions from '@/components/atoms/MainPostOptions'
import { DEFAULT_PADDING } from '@/configs/theme'
import MainHeader from '@/components/layout/MainHeader'

type Props = {}

export default function page({}: Props) {
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
