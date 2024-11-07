'use client'

import { DEFAULT_PADDING } from '@/configs/theme'
import { useNotificationContext } from '@/context/notifications.context'
import { NotificationsType } from '@/firebase/service/notifications/notifications.types'
import { timeAgo } from '@/utils/index.utils'
import { Avatar, Button, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'

type Props = {}

const ButtonText: Record<NotificationsType['type'], string> = {
	rescheduled: 'Inspect Now',
	cancelled: 'View',
	inspection: 'Inspect Now',
	comment: 'View',
	message: 'Reply',
	call: 'Call Back',
	comment_reply: 'Reply',
	profile_view: 'View',
	bookmark: 'Message',
	reservation: 'Message',
	background_check: 'Message',
}

export default function NotificationsPage({}: Props) {
	const { notifications, updateNotification, readAllNotifications } =
		useNotificationContext()

	return (
		<Flex flexDir={'column'} gap={DEFAULT_PADDING} p={DEFAULT_PADDING}>
			<Flex alignItems={'center'} justifyContent={'space-between'}>
				<Text fontSize={{ base: 'base', md: 'lg' }} fontWeight={500}>
					Notifications
				</Text>
				<Button
					display={'flex'}
					gap={2}
					alignItems={'center'}
					justifyContent={'center'}
					fontSize={{ base: 'sm', md: 'base' }}
					fontWeight={300}
					color={'brand'}
					bgColor={'transparent'}
					p={0}
					_hover={{ bgColor: 'transparent' }}
					onClick={async () =>
						await readAllNotifications(
							notifications
								.filter((notification) => !notification.is_read)
								.map((notification) => notification.id),
						)
					}
				>
					Mark all as Read
				</Button>
			</Flex>
			<Flex
				flexDir={'column'}
				justifyContent={'center'}
				alignItems={'stretch'}
				gap={'4px'}
			>
				{notifications.length === 0 && (
					<Text
						fontSize={'lg'}
						fontWeight={500}
						textAlign={'center'}
						w={'100%'}
					>
						No Notifications
					</Text>
				)}
				{notifications.map((notification) => (
					<Flex
						key={notification.id}
						borderBottom={'1px'}
						borderColor={'border_color'}
						flexDir={'column'}
						py={DEFAULT_PADDING}
						px={`calc(${DEFAULT_PADDING} * 0.5)`}
						gap={'12px'}
						_light={{
							backgroundColor: notification.is_read ? '' : 'brand_lighter',
						}}
						_dark={{
							backgroundColor: notification.is_read ? '' : 'brand_darker',
							borderColor: 'dark_light',
						}}
					>
						<Text
							fontSize={{ base: 'sm', md: 'base' }}
							fontWeight={300}
							alignSelf={'flex-end'}
							color={'text_muted'}
						>
							{timeAgo(notification.createdAt)}
						</Text>
						<Flex
							alignItems={'center'}
							justifyContent={'space-between'}
							gap={DEFAULT_PADDING}
						>
							<Avatar
								src={
									notification.sender_details
										? notification.sender_details.avatar_url
										: 'https://bit.ly/broken-link'
								}
								size={{
									md: 'md',
									base: 'md',
								}}
							/>
							<Text fontWeight={400} fontSize={{ base: 'base', md: 'lg' }}>
								{notification.sender_details ? (
									<Link href={`/user/${notification.sender_details.id}`}>
										<Text
											textTransform={'capitalize'}
											fontWeight={'500'}
											color={'brand'}
											as={'span'}
										>
											{notification.sender_details.last_name}{' '}
											{notification.sender_details.first_name}
										</Text>
									</Link>
								) : (
									<Text
										textTransform={'capitalize'}
										fontWeight={'500'}
										color={'brand'}
										as={'span'}
									>
										Unknown
									</Text>
								)}{' '}
								{notification.message}
							</Text>
							<Link href={notification.action_url || ''}>
								<Button
									fontSize={{ base: 'sm', md: 'base' }}
									fontWeight={400}
									border={'1px'}
									_light={{
										color: 'black',
										bgColor: 'brand_lighter',
										borderColor: 'black',
									}}
									_dark={{
										color: 'white',
										borderColor: 'white',
										bgColor: 'brand_darker',
									}}
									py={{ base: '8px', md: '10px' }}
									px={{ base: '24px', md: '30px' }}
									rounded={32}
									onClick={async () => {
										if (!notification.is_read)
											await updateNotification(notification.id)
									}}
								>
									{ButtonText[notification.type]}
								</Button>
							</Link>
						</Flex>
					</Flex>
				))}
			</Flex>
		</Flex>
	)
}
