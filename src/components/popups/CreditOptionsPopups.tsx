import { DEFAULT_PADDING } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context';
import { formatPrice } from '@/utils/index.utils'
import {
	Flex,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	Text,
} from '@chakra-ui/react'
import React, { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';

type Props = {
	isOpen: boolean
	onClose: () => void
}

export default function CreditOptionsPopups({ isOpen, onClose }: Props) {
	const [selectedCredit, setSelectedCredit] = useState(0);
	return (
		<Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
			<ModalOverlay />
			<ModalContent>
				<ModalCloseButton />
				<ModalBody bg="dark">
					<Flex flexDirection={'column'} gap={DEFAULT_PADDING}>
						<Flex gap={1} flexDirection={'column'} mb={DEFAULT_PADDING}>
							<Text fontSize={'x-large'} color="text_muted" fontWeight={'bold'}>
								Select Credit Amount
							</Text>
							<Text fontSize={'lg'} color="text_muted" fontWeight={'normal'}>
								Pay as you go credits.
							</Text>
						</Flex>
						<Flex flexDirection={'column'} gap={DEFAULT_PADDING}>
							<EachCredit heading="For quick chat" credit={2000} />
							<EachCredit heading="For those who call a lot" credit={3000} />
							<EachCredit heading="For inspection lovers" credit={6000} />
							<EachCredit heading="Have it all " credit={12000} />
						</Flex>
					</Flex>
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}

const EachCredit = ({
	credit,
	heading,
}: {
	heading: string
	credit: number
}) => {
	const { authState } = useAuthContext();
	const config = {
		reference: (new Date()).getTime().toString(),
		email: authState.user?.email,
		amount: parseInt(`${credit}00`),
		publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
	};

	const onSuccess = (reference:any) => {
		console.log(reference);
	};

	const onClose = () => {
		console.log('closed')
	}
	const initializePayment = usePaystackPayment(config as any);
	
	return (
		<Flex
			//@ts-ignore
			onClick={() => initializePayment(onSuccess, onClose)}
			cursor={'pointer'}
			p={DEFAULT_PADDING}
			border="1px"
			borderColor={'border_color'}
			_dark={{
				borderColor: 'dark_light',
			}}
			_hover={{
				bg: 'dark_light',
			}}
			flexDirection={'column'}
			gap={1}
			rounded={'lg'}
		>
			<Flex
				fontSize={'xx-large'}
				fontWeight={'bold'}
				gap={DEFAULT_PADDING}
				alignItems={'center'}
			>
				₦{formatPrice(credit)}{' '}
				<Text
					fontSize={'lg'}
					fontWeight={'normal'}
					color="text_muted"
					textDecor={'line-through'}
				>
					₦{formatPrice(credit * 2)}
				</Text>
			</Flex>
			<Text color="text_muted">{heading}</Text>
		</Flex>
	)
}
