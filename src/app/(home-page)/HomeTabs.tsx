'use client'

import CloseIcon from '@/assets/svg/close-icon-dark'
import CreditInfo from '@/components/info/CreditInfo/CreditInfo'
import { DEFAULT_PADDING } from '@/configs/theme'
import { creditTable, homeTabSearch } from '@/constants'
import { useAuthContext } from '@/context/auth.context'
import useDrag from '@/hooks/useDrag'
import usePayment from '@/hooks/usePayment'
import { Box, Modal, ModalContent, ModalOverlay } from '@chakra-ui/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu'

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>

const elemPrefix = 'test'
const getId = (index: number) => `${elemPrefix}${index}`

export default function HomeTabs() {
	const { dragStart, dragStop, dragMove, dragging } = useDrag()
	const handleDrag =
		({ scrollContainer }: scrollVisibilityApiType) =>
		(ev: React.MouseEvent) =>
			dragMove(ev, (posDiff) => {
				if (scrollContainer.current) {
					scrollContainer.current.scrollLeft += posDiff
				}
			})

	const { authState } = useAuthContext()

	// console.log('from homeTabs.......', authState)

	if (!authState.user) return null

	return (
		<Box
			onMouseLeave={dragStop}
			py={DEFAULT_PADDING}
			borderBottom={'1px'}
			borderColor={'border_color'}
			_dark={{
				borderColor: 'dark_light',
			}}
		>
			<ScrollMenu
				onWheel={onWheel}
				onMouseDown={() => dragStart}
				onMouseUp={() => dragStop}
				onMouseMove={handleDrag}
			>
				{homeTabSearch.map(({ id, ref, title }) => (
					<Box ml={DEFAULT_PADDING} key={id}>
						<EachTab label={title} slug={id} params={ref} />
					</Box>
				))}
			</ScrollMenu>
		</Box>
	)
}

function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
	const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15

	if (isThouchpad) {
		ev.stopPropagation()
		return
	}

	if (ev.deltaY < 0) {
		apiObj.scrollNext()
	} else if (ev.deltaY > 0) {
		apiObj.scrollPrev()
	}
}

const EachTab = ({
	label,
	slug,
	params,
}: {
	label: string
	slug: string
	params: string
}) => {
	const [open, setOpen] = useState(false)
	const { authState } = useAuthContext()
	const [_, paymentActions] = usePayment()

	return (
		<>
			<Modal isOpen={open} onClose={() => setOpen(false)} size={'xl'}>
				<ModalOverlay />
				<ModalContent
					w={'100%'}
					margin={'auto'}
					flexDir={'column'}
					alignItems={'center'}
					justifyContent={'center'}
					position={'relative'}
					rounded={'16px'}
					_dark={{ bgColor: 'black' }}
					_light={{
						bgColor: '#FDFDFD',
						border: '1px',
						borderColor: 'text_muted',
					}}
					py={{ base: '16px', md: '24px' }}
					px={{ base: '16px', sm: '24px', md: '32px' }}
					gap={{ base: '24px', md: '32px' }}
				>
					<Box
						pos={'absolute'}
						top={{ base: '16px', md: '30px' }}
						right={{ base: '16px', md: '30px' }}
						cursor={'pointer'}
						onClick={() => setOpen(false)}
					>
						<CloseIcon />
					</Box>
					<Link href={`?${params}=${slug}`}>
						<CreditInfo
							credit={creditTable.FLAT_SHARE_PROFILE_SEARCH}
							onUse={async () => {
								await paymentActions.decrementCredit({
									amount: creditTable.FLAT_SHARE_PROFILE_SEARCH,
									user_id: authState.user?._id as string,
								})

								setOpen(false)
							}}
						/>
					</Link>
				</ModalContent>
			</Modal>
			<Box
				onClick={() => setOpen(true)}
				cursor={'pointer'}
				userSelect={'none'}
				rounded={'xl'}
				border={'1px'}
				borderColor={'border_color'}
				_dark={{
					borderColor: 'dark_light',
				}}
				p={DEFAULT_PADDING}
				w="100%"
				style={{ textWrap: 'nowrap' }}
			>
				{label}
			</Box>
		</>
	)
}
