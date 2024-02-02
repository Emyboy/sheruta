import { DEFAULT_PADDING } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
import MessagesService from '@/firebase/service/messages/messages.firebase'
import { DirectMessageData } from '@/firebase/service/messages/messages.types'
import {
	Button,
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
import { BiCopy, BiDotsVertical, BiFlag, BiTrash } from 'react-icons/bi'

type Props = {
	message: DirectMessageData
}

export default function EachMessageBobble({ message }: Props) {
	const toast = useToast()
	const { authState } = useAuthContext()
	const user = authState.user
	const isUserOwn = message._sender_id === user?._id

	const handleCopy = () => {
		toast({ title: `Message copied` })
	}

	const handleDelete = async () => {
		try {
			await MessagesService.deleteMessage(message.id)
		} catch (error) {
			toast({ title: `Error deleting message`, status: 'error' })
		}
	}

	return (
		<>
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
					rounded={'lg'}
					p={DEFAULT_PADDING}
					bg={isUserOwn ? 'dark_light' : 'dark'}
					flexDirection={'column'}
					gap={DEFAULT_PADDING}
				>
					<Text
						textAlign={message.message_text.length > 20 ? 'justify' : 'end'}
					>
						{message.message_text}
					</Text>
					<Flex justifyContent={'flex-end'} color={'text_muted'}>
						<Menu>
							<MenuButton
								as={Button}
								size={'xs'}
								bg="none"
								color="dark_lighter"
							>
								<BiDotsVertical />
							</MenuButton>
							<MenuList bg="dark" zIndex={200}>
								<CopyToClipboard
									text={message.message_text}
									onCopy={handleCopy}
								>
									<MenuItem icon={<BiCopy size={20} />}>Copy</MenuItem>
								</CopyToClipboard>
								{/* <MenuItem icon={<BiFlag size={20} />}>Report</MenuItem> */}
								{isUserOwn && (
									<>
										<Divider />
										<MenuItem
											icon={<BiTrash size={20} />}
											onClick={handleDelete}
										>
											Delete
										</MenuItem>
									</>
								)}
							</MenuList>
						</Menu>
					</Flex>
				</Flex>
			</Flex>
		</>
	)
}
