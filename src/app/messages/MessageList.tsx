import { Flex } from '@chakra-ui/react'
import React from 'react'
import MessageContainer from './components/MessageContainer/MessageContainer'
import { DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'

type Props = {}

export default function MessageList({}: Props) {
	return (
		<Flex flexDir={'column'} gap={DEFAULT_PADDING} pb={NAV_HEIGHT}>
			{new Array(13).fill(null).map(() => {
				return <MessageContainer key={Math.random()} />
			})}
		</Flex>
	)
}
