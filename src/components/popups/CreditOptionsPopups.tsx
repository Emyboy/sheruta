'use client'
import { DEFAULT_PADDING } from '@/configs/theme'
import { useAppContext } from '@/context/app.context'
import { useAuthContext } from '@/context/auth.context'
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
import React, { useEffect, useState } from 'react'
import { usePaystackPayment } from 'next-paystack'
import { HookConfig } from 'react-paystack/dist/types'
import usePayment from '@/hooks/usePayment'

type Props = {}

export default function CreditOptionsPopups({ }: Props) {
	const { appState, setAppState } = useAppContext()
	const { show_credit } = appState

	if (!show_credit) {
		return null
	}

	return (
		<Modal
			isOpen
			onClose={() => setAppState({ show_credit: false })}
			size={'xl'}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalCloseButton />
				<ModalBody bg="dark">
					<CreditOptions />
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}

export const CreditOptions = () => {
	const [_, paymentActions] = usePayment()
	const { authState } = useAuthContext()
	const [credit, setCredit] = useState(0)

	const config: HookConfig = {
		reference: new Date().getTime().toString(),
		email: authState.user?.email as string,
		amount: parseInt(`${credit}00`),
		publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
		firstname: authState.user?.first_name,
		lastname: authState.user?.last_name,
		label: 'Sheruta credit purchase',
		phone: authState.user_info?.primary_phone_number,
	}

	const onSuccess = (reference: any) => {
		; (async () => {
			if (reference) {
				await paymentActions.incrementCredit({
					amount: Number(credit),
					user_id: authState.user?._id as string,
				})
			}
		})()
	}

	const onClose = () => {
		setCredit(0)
	}

	const initializePayment = usePaystackPayment(config as any)

	const pay = () => {
		//@ts-ignore
		initializePayment(onSuccess, onClose)
	}

	useEffect(() => {
		if (credit) {
			pay()
		}
	}, [credit])

	return (
		<>
			<Flex as="form" flexDirection={'column'} gap={DEFAULT_PADDING}>
				<Flex gap={1} flexDirection={'column'} mb={DEFAULT_PADDING}>
					<Text fontSize={'x-large'} color="text_muted" fontWeight={'bold'}>
						Select Credit Amount
					</Text>
					<Text fontSize={'lg'} color="text_muted" fontWeight={'normal'}>
						Pay as you go credits.
					</Text>
				</Flex>
				<Flex flexDirection={'column'} gap={DEFAULT_PADDING}>
					<EachCredit
						onClick={(value) => setCredit(value)}
						heading="For quick chat"
						credit={2000}
					/>
					<EachCredit
						onClick={(value) => setCredit(value)}
						heading="For those who call a lot"
						credit={3000}
					/>
					<EachCredit
						onClick={(value) => setCredit(value)}
						heading="For inspection lovers"
						credit={6000}
					/>
					<EachCredit
						onClick={(value) => setCredit(value)}
						heading="Have it all "
						credit={12000}
					/>
				</Flex>
			</Flex>
		</>
	)
}

const EachCredit = ({
	credit,
	heading,
	onClick,
}: {
	heading: string
	credit: number
	onClick: (credit: number) => void
}) => {
	return (
		<Flex
			onClick={() => onClick(credit)}
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
