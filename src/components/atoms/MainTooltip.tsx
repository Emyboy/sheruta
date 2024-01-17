import { Tooltip, TooltipProps } from '@chakra-ui/react'
import React from 'react'

interface Props extends TooltipProps {}

export default function MainTooltip(props: Props) {
	const { children, label } = props
	return (
		<Tooltip
			border={'1px'}
			borderColor={'white'}
			label={label}
			color="dark"
			bg="white"
			_dark={{ bg: 'dark', color: 'border_color', borderColor: 'dark_light' }}
			px={5}
			py={2}
			rounded={'lg'}
			{...props}
		>
			{children}
		</Tooltip>
	)
}
