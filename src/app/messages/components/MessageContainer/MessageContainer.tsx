import { DEFAULT_PADDING } from '@/configs/theme'
import { Avatar, Flex, Text } from '@chakra-ui/react'
import React from 'react'

type Props = {}

export default function MessageContainer({}: Props) {
	return (
		<Flex gap={DEFAULT_PADDING}>
			<Avatar size="sm" />
			<Flex flexDir={'column'}>
				<Text size="sm">The person name</Text>
				<Flex flexDir={'column'}>
					{new Array(3).fill(null).map(() => {
						return (
							<EachMessage
								key={Math.random()}
								message={`lorem afasdf asdfasdf ` + Math.random()}
							/>
						)
					})}
				</Flex>
			</Flex>
		</Flex>
	)
}

const EachMessage = ({ message }: any) => {
	return <Text>{message}</Text>
}
