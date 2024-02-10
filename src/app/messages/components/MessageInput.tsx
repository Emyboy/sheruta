'use client'
import { DEFAULT_PADDING } from '@/configs/theme'
import { Button, Flex, Textarea } from '@chakra-ui/react'
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
		setMessage('')
	}

	return (
		<Flex
			as="form"
			onSubmit={_onSubmit}
			alignItems={'center'}
			flex={1}
			px={DEFAULT_PADDING}
		>
			<Textarea
				as="textarea"
				resize={'none'}
				border={'0px'}
				outline={'none'}
				flex={1}
				background={'none'}
				onChange={(e) => setMessage(e.target.value)}
				placeholder="Type your message.."
				value={message}
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
