import EachRequest from '@/components/EachRequest/EachRequest'
import { DEFAULT_PADDING } from '@/configs/theme'
import { Flex } from '@chakra-ui/react'
import React from 'react'
import SearchResultUsers from './(components)/SearchResultUsers'

type Props = {}

export default function SearchPage({}: Props) {
	return (
		<Flex flexDir={'column'} gap={DEFAULT_PADDING}>
			<Flex flexDir={'column'} px={DEFAULT_PADDING}>
				<EachRequest />
				<EachRequest />
			</Flex>
			<SearchResultUsers />
			<Flex flexDir={'column'} px={DEFAULT_PADDING}>
				<EachRequest />
				<EachRequest />
				<EachRequest />
				<EachRequest />
			</Flex>
		</Flex>
	)
}
