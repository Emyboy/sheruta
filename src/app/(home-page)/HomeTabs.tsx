'use client'

import { DEFAULT_PADDING } from '@/configs/theme'
import { homeTabSearch } from '@/constants'
import useDrag from '@/hooks/useDrag'
import { Box } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
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
	return (
		<Link href={`?${params}=${slug}`}>
			<Box
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
		</Link>
	)
}
