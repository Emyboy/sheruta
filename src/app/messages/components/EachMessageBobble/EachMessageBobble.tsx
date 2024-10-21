import { DEFAULT_PADDING } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
import { DirectMessageData } from '@/firebase/service/messages/messages.types'
import {
	Divider,
	Flex,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useToast,
} from '@chakra-ui/react'
import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { BiCopy, BiTrash } from 'react-icons/bi'

type Props = {
	message: DirectMessageData
	handleDelete: (message_id: string) => Promise<void>
}

export default function EachMessageBobble({ message, handleDelete }: Props) {
	const toast = useToast()
	const { authState } = useAuthContext()
	const user = authState.user
	const isUserOwn = message.sender._id === user?._id

	const handleCopy = () => {
		toast({ title: `Message copied` })
	}


	return (
		<>
			<Menu>
				<MenuButton
					cursor={'auto'}
					// as={Button}
					// size={'xs'}
					// bg="none"
					// color="dark_lighter"
				>
					<Flex
						justifyContent={'space-between'}
						flexDir={isUserOwn ? 'row' : 'row-reverse'}
						rounded={'md'}
						width={'full'}
					>
						<div></div>

						<Flex
							_hover={{
								shadow: 'xl',
							}}
							cursor={'pointer'}
							maxW={'80%'}
							border={isUserOwn ? '0px' : '1px'}
							borderColor={'border_color'}
							_dark={{
								borderColor: 'dark_light',
							}}
							rounded={'xl'}
							p={DEFAULT_PADDING}
							bg={isUserOwn ? 'dark_light' : 'dark'}
							flexDirection={'column'}
							// gap={DEFAULT_PADDING}
						>
							<Text
								textAlign={message.content.length > 20 ? 'justify' : 'end'}
								fontSize={'sm'}
							>
								{message.content}
							</Text>
							<Flex justifyContent={'flex-end'} color={'text_muted'}></Flex>
						</Flex>
					</Flex>
				</MenuButton>
				<MenuList bg="dark" zIndex={200}>
					<CopyToClipboard text={message.content} onCopy={handleCopy}>
						<MenuItem icon={<BiCopy size={20} />}>Copy</MenuItem>
					</CopyToClipboard>
					{/* <MenuItem icon={<BiFlag size={20} />}>Report</MenuItem> */}
					{isUserOwn && (
						<>
							<Divider />
							<MenuItem icon={<BiTrash size={20} />} onClick={async() => await handleDelete(message._id)}>
								Delete
							</MenuItem>
						</>
					)}
				</MenuList>
			</Menu>
		</>
	)
}
