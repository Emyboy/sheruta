import { DEFAULT_PADDING } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
import { DirectMessageData } from '@/firebase/service/messages/messages.types'
import { Button, Flex, Text } from '@chakra-ui/react'
import React from 'react'

type Props = {
    message: DirectMessageData
}

export default function EachMessageBobble({ message }: Props) {
    const { authState } = useAuthContext()
    const user = authState.user
    const isUserOwn = message._sender_id === user?._id

    return (
        <Flex
            
            justifyContent={'space-between'}
            
            flexDir={isUserOwn ? 'row' : 'row-reverse'}
            rounded={'md'}
            width={'auto'}
        >
            <div></div>
            <Text rounded={'md'} p={DEFAULT_PADDING} bg={isUserOwn ? 'dark_light' : 'dark'}>{message.message_text}</Text>
        </Flex>
    )
}
