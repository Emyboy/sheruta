import React from 'react'
import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	ModalProps,
} from '@chakra-ui/react'
import { DEFAULT_PADDING } from '@/configs/theme'

interface Props extends ModalProps {}

export default function MainModal(props: Props) {
	const { isOpen, onClose, children } = props
	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent rounded={'xl'}>
				<ModalCloseButton />
				<ModalBody
					_dark={{
						bg: 'dark',
					}}
					bg="white"
					rounded={'xl'}
					display={'flex'}
					flexDirection={'column'}
					gap={DEFAULT_PADDING}
					py={DEFAULT_PADDING}
				>
					{children}
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}
