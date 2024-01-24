'use client'
import { DEFAULT_PADDING, SIDE_NAV_WIDTH } from '@/configs/theme'
import { Flex, Text, useColorMode } from '@chakra-ui/react'
import Skeleton from 'react-loading-skeleton'
import React from 'react'

export default function EachConversationLoading() {
	const { colorMode } = useColorMode()
	return (
		<>
			<Flex
				opacity={colorMode === 'dark' ? '0.2' : 0}
				minW={`calc(${SIDE_NAV_WIDTH} - ${DEFAULT_PADDING})`}
				p={DEFAULT_PADDING}
				alignItems={'center'}
				gap={3}
				borderBottom={'1px'}
				borderColor={'border_color'}
				_dark={{
					borderColor: 'dark_light',
				}}
			>
				{/* <Avatar size={'sm'} /> */}
				<Skeleton width={'40px'} height={'40px'} circle />
				<Flex flexDirection={'column'} flex={1}>
					<Text>
						<Skeleton width={'200px'} />
					</Text>
					<Text fontSize={'sm'} color="text_muted">
						<Skeleton width={'100px'} />
					</Text>
				</Flex>
			</Flex>
		</>
	)
}
