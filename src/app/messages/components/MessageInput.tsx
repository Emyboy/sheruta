'use client'
import { DEFAULT_PADDING } from '@/configs/theme'
import { Button, Flex } from '@chakra-ui/react'
import React, { useState } from 'react'
import { HiOutlinePaperAirplane } from 'react-icons/hi'

type Props = {
	onSubmit: (message: string) => void
}

export default function MessageInput({ onSubmit }: Props) {
	const [message, setMessage] = useState('')

	const _onSubmit = async (e: any) => {
		e.preventDefault()
		if (message) {
			onSubmit(message)
		}
	}

	return (
		<Flex
			as="form"
			onSubmit={_onSubmit}
			alignItems={'center'}
			h="full"
			px={DEFAULT_PADDING}
		>
			<input
				onChange={(e) => setMessage(e.target.value)}
				style={{ border: '0px', outline: 'none', flex: 1, background: 'none' }}
				placeholder="Type your message.."
			/>
			<Button
				variant={'ghost'}
				color={'border_color'}
				_dark={{ color: 'dark_lighter' }}
			>
				<HiOutlinePaperAirplane />
			</Button>
		</Flex>
	)
}
