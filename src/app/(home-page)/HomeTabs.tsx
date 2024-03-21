'use client'
import { DEFAULT_PADDING } from '@/configs/theme'
import { LocationKeywordData } from '@/firebase/service/options/location-keywords/location-keywords.types'
import { StateData } from '@/firebase/service/options/states/states.types'
import useDrag from '@/hooks/useDrag'
import { Box } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu'

type Props = {
	locations: LocationKeywordData[]
	states: StateData[]
}
type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>

const elemPrefix = 'test'
const getId = (index: number) => `${elemPrefix}${index}`

export default function HomeTabs({ locations, states }: Props) {
	const getItems = () =>
		locations.map((location, index) => ({
			id: getId(index),
			name: location.name,
			slug: location.slug,
		}))


	const [items] = React.useState(getItems)

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
				{items.map(({ id, name, slug }) => (
					<Box ml={DEFAULT_PADDING} key={id}>
						<EachTab label={name} slug={slug} />
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

const EachTab = ({ label, slug }: { label: string; slug: string; }) => {
	return (
		<Link href={`/search?state=${slug}`}>
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
			>
				{label}
				{/* <Text>{label}</Text> */}
			</Box>
		</Link>
	)
}
