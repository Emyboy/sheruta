import { DEFAULT_PADDING } from '@/configs/theme'
import { Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { BiSolidMegaphone } from 'react-icons/bi'

type Props = {}

export default function MainPostOptions({ }: Props) {
    return (
        <Flex gap={DEFAULT_PADDING}>
            <Link href={`/request/host`} style={{ width: '50%' }}>
                <EachOption label='Post available space' />
            </Link>
            <Link href={`/request/guest`} style={{ width: '50%' }}>
                <EachOption label='Request a space' />
            </Link>
        </Flex>
    )
}

const EachOption = ({ label }: { label: string }) => {
    return (
        <Flex
            flexDir={'column'}
            alignItems={'center'}
            // w={'50%'}
            border={'1px'}
            _dark={{
                borderColor: 'dark_light',
                color: 'dark_lighter'
            }}
            _hover={{
                _dark: {
                    color: 'white',
                    borderColor: 'white'
                }
            }}
            rounded={'md'}
            h='200px'
            gap={DEFAULT_PADDING}
            justifyContent={'center'}
        >
            <BiSolidMegaphone size={60} />
            <Text fontSize={'x-large'}>{label}</Text>
        </Flex>
    )
}
