'use client'
import React from 'react'
import MainTooltip from './MainTooltip'
import { Button } from '@chakra-ui/react'

type Props = {
	Icon: any
	active?: boolean
	label: string
	onClick?: () => void
}

export default function MainIconBtn({ Icon, active, label, onClick }: Props) {
	return (
		<MainTooltip label={label}>
			<Button
				onClick={onClick ? onClick : () => {}}
				p="0px"
				h="45px"
				w="45px"
				border="1px"
				borderColor={'border_color'}
				color={active ? 'white' : 'text_muted'}
				bg={active ? 'dark' : 'white'}
				_dark={{
					bg: active ? 'brand_darker' : 'dark',
					borderColor: active ? 'brand' : 'dark_light',
					color: active ? 'brand' : 'dark_lighter',
				}}
				_hover={{
					// bg: 'dark',
					color: 'dark',
					borderColor: 'dark',
					_dark: {
						color: 'brand',
						borderColor: 'brand',
					},
				}}
			>
				<Icon size={25} />
			</Button>
		</MainTooltip>
	)
}
