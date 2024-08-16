import NoApartmentIcon from '@/assets/svg/no-apartment-icon'
import { DEFAULT_PADDING } from '@/configs/theme'
import { Flex, Text } from '@chakra-ui/react'
import React from 'react'

export default function NoApartment() {
	return (
		<Flex
			gap={'32px'}
			flexDir={'column'}
			alignItems={'center'}
			justifyContent={'center'}
			p={DEFAULT_PADDING}
		>
			<NoApartmentIcon />
			<Text
				fontWeight={400}
				fontSize={'20px'}
				textAlign={'center'}
				_light={{ color: '#11171799' }}
				color={'text_muted'}
			>
				There is No Apartment that matches your search results
			</Text>
		</Flex>
	)
}
