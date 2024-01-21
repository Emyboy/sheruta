import { DEFAULT_PADDING } from '@/configs/theme'
import { Button, Flex, Input } from '@chakra-ui/react'
import React from 'react'
import { HiOutlinePaperAirplane } from 'react-icons/hi'

type Props = {}

export default function MessageInput({}: Props) {
	return (
		<Flex as="form" alignItems={'center'} h="full" px={DEFAULT_PADDING}>
			<input
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
