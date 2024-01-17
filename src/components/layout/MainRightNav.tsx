import { DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'
import { Divider, Flex, Text } from '@chakra-ui/react'
import React from 'react'

type Props = {}

export default function MainRightNav({ }: Props) {
    return (
        <Flex
            minH={`calc(100vh - ${NAV_HEIGHT})`}
            flexDirection={'column'}
            pl={DEFAULT_PADDING}
            w='full'
        >
            <Flex p={DEFAULT_PADDING} bg='dark_light' rounded={'md'} flexDirection={'column'} gap={DEFAULT_PADDING}>
                <Text fontSize={'lg'} color='dark_lighter' fontWeight={'bold'}>Locations</Text>
                <Divider bg='dark_light' />
            </Flex>
        </Flex>
    )
}