'use client'
import React from 'react'
import MainTooltip from './MainTooltip'
import { Box, Button } from '@chakra-ui/react'

type Props = {
	Icon: any
	active?: boolean
	label: string
	onClick?: () => void
	hasNotification?: boolean
}

export default function MainIconBtn({
	Icon,
	active,
	label,
	onClick,
	hasNotification,
}: Props) {
	return (
		<MainTooltip label={label}>
			<Button
				position={'relative'}
				onClick={onClick ? onClick : () => {}}
				p="0px"
				h={{ base: '30px', sm: '45px' }}
				w={{ base: '30px', sm: '45px' }}
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
				fontSize={{ base: '18px', sm: '24px' }}
			>
				{hasNotification && (
					<Box
						p={'6px'}
						rounded={'full'}
						bg="red"
						position={'absolute'}
						right={-1}
						top={-1}
					/>
				)}
				<Icon />
			</Button>
		</MainTooltip>
	)
}
