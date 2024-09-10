import MainContainer from '@/components/layout/MainContainer'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import MainLeftNav from '@/components/layout/MainLeftNav'
import { DEFAULT_PADDING } from '@/configs/theme'
import MainBackHeader from '@/components/atoms/MainBackHeader'
import HabitsForm from '@/components/forms/Settings/HabitsForm'

export default function Page() {
	return (
		<Flex justifyContent={'center'}>
			<MainContainer>
				<ThreeColumnLayout header={<MainBackHeader />}>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>
					<Box p={DEFAULT_PADDING}>
						<Box marginBottom={10}>
							<Box marginBottom={10}>
								<HabitsForm />
							</Box>
						</Box>
					</Box>
				</ThreeColumnLayout>
			</MainContainer>
		</Flex>
	)
}
