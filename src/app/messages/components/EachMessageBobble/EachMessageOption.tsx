import { DEFAULT_PADDING } from '@/configs/theme'
import { DirectMessageData } from '@/firebase/service/messages/messages.types'
import {
    Divider,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
} from '@chakra-ui/react'
import React from 'react'
import { BiCopy, BiFlag, BiShare, BiTrash } from 'react-icons/bi'

type Props = {
    isOpen: boolean
    onClose: () => void;
    messageData: DirectMessageData;
    onReply?: () => void;
}

export default function EachMessageOption({ isOpen, onClose, onReply }: Props) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg="white" _dark={{ bg: 'dark' }}>
                <ModalHeader textAlign={'center'}>Options</ModalHeader>
                <ModalCloseButton />
                <ModalBody
                    pb={DEFAULT_PADDING}
                    display={'flex'}
                    flexDirection={'column'}
                    gap={DEFAULT_PADDING}
                >
                    {onReply && <EachOption Icon={BiShare} label="Reply" />}
                    <EachOption Icon={BiCopy} label="Copy" />
                    {/* <EachOption Icon={BiFlag} label="Report" /> */}
                    <Divider />
                    <EachOption Icon={BiTrash} label="Delete" />
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

const EachOption = ({ Icon, label }: { Icon: any; label: string }) => {
    return (
        <Flex
            _hover={{
                bg: 'dark_light',
            }}
            borderRadius={DEFAULT_PADDING}
            p={DEFAULT_PADDING}
            justifyContent={'center'}
            gap={3}
            alignItems={'center'}
            cursor={'pointer'}
        >
            <Icon size={25} /> <Text>{label}</Text>
        </Flex>
    )
}
