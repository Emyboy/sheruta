import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'

type Props = {
	Icon: any
	heading: string
	subHeading: string
}

export default function EachPersonalInfo({ Icon, heading, subHeading }: Props) {
	return (
		<Flex
			flexDir={'column'}
			w={{
				md: 'calc(100% / 3)',
				base: 'calc(100% / 2)',
			}}
			mb={3}
		>
			<Text _dark={{ color: 'text_muted' }}>{heading}</Text>
			<Flex alignItems={'center'} gap={1}>
				<Box p={1} rounded={'full'} bg="dark_light" color="brand">
					<Icon />
				</Box>
				<Text fontSize={'sm'} isTruncated>
					{subHeading}
				</Text>
			</Flex>
		</Flex>
	)
}
