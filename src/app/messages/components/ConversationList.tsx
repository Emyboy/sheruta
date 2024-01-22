'use client'
import { Flex } from '@chakra-ui/react'
import React, { useState } from 'react'
import EachConversation from './EachConversation'
import { DEFAULT_PADDING, NAV_HEIGHT, SIDE_NAV_WIDTH } from '@/configs/theme'
import Link from 'next/link'
import { useParams } from 'next/navigation'

type Props = {}

export default function ConversationList({ }: Props) {

	const params = useParams()

	return (
		<Flex
			flexDirection={'column'}
			w={{
				lg: `calc(100% - ${DEFAULT_PADDING})`,
				md: '60px',
			}}
			minH={`calc(100vh - ${NAV_HEIGHT})`}
			py={DEFAULT_PADDING}
			alignItems={{
				lg: 'flex-start',
				bse: 'center',
			}}
		>
			{new Array(6).fill(null).map((_: any, index: any) => {
				let id = crypto.randomUUID() + Date.now();
				return (
					<Link href={`/messages/${id}`} key={Math.random()}>
						<EachConversation
							active={params?.message_id == id}
						/>
					</Link>
				)
			})}
		</Flex>
	)
}
