import { DEFAULT_PADDING } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
import { NotificationsBodyMessage } from '@/firebase/service/notifications/notifications.firebase'
import { UserProfile } from '@/firebase/service/userProfile/user-profile-types'
import { createNotification } from '@/utils/actions'
import {
	Badge,
	Box,
	Button,
	Card,
	CardBody,
	Divider,
	Flex,
	Image,
	Link,
	Stack,
	Text,
} from '@chakra-ui/react'
import { BiBookmark } from 'react-icons/bi'

export default function ProfileSnippetCard({ item }: { item: UserProfile }) {
	const { authState } = useAuthContext()

	return (
		<Flex m={4}>
			<Card
				direction={{ base: 'column', sm: 'row' }}
				overflow="hidden"
				variant="outline"
				w={'100%'}
			>
				<Image
					objectFit="cover"
					maxW={{ base: '100%', sm: '200px' }}
					w="600px"
					src={item._user_ref.avatar_url || '/assets/avatar.webp'}
					alt="Profile Image"
				/>

				<Stack w={'100%'}>
					<Link
						href={`/user/${item._user_ref._id}`}
						style={{ textDecoration: 'none' }}
						onClick={async () =>
							authState.user?._id !== item._user_ref._id &&
							(await createNotification({
								is_read: false,
								message: NotificationsBodyMessage.profile_view,
								recipient_id: item._user_ref._id,
								type: 'profile_view',
								sender_details: authState.user
									? {
											avatar_url: authState.user.avatar_url,
											first_name: authState.user.first_name,
											last_name: authState.user.last_name,
											id: authState.user._id,
										}
									: null,
								action_url: `/user/${item._user_ref._id}`,
							}))
						}
					>
						<CardBody mb={0} border="none">
							<Flex justify="space-between" align="center" mb={3}>
								<Text>{`${item._user_ref.first_name} ${item._user_ref.last_name}`}</Text>

								<Badge color="text_color" background="border_color">
									Promoted
								</Badge>
							</Flex>

							<Flex>
								<Text color="muted_text" py="2" fontSize="0.8em">
									{item.bio
										? item.bio.length > 84
											? `${item.bio.substring(0, 84)}......`
											: item.bio
										: 'Hi! I am a user of Sheruta, you should go through my profile and see if we are a match'}
								</Text>
							</Flex>

							<Flex
								style={{ fontSize: '10px' }}
								justify="space-between"
								align="center"
							>
								<Text color="text_muted" fontWeight="700">
									{`Preferred area: ${item.location_keyword.name}, ${item.state.name}`}{' '}
								</Text>
							</Flex>
							<Flex
								style={{ fontSize: '10px' }}
								mt={'.5rem'}
								justify="start"
								gap={DEFAULT_PADDING}
								align="center"
							>
								<Badge
									colorScheme="green"
									rounded="md"
									textTransform="capitalize"
								>
									{item.service_type}
								</Badge>
								<Badge
									colorScheme={item.seeking ? 'orange' : 'teal'}
									textTransform="capitalize"
								>
									{item?.seeking ? 'Seeker' : 'I have a space'}
								</Badge>
							</Flex>
						</CardBody>
					</Link>
					<Divider />
					<Flex gap={2} mt={'auto'} align="center" mb={2}>
						<Button colorScheme="lueb" color="text_muted">
							<BiBookmark style={{ fontSize: '1.5em' }} />
						</Button>
						<Box mr={2} color="text_muted">
							{`${item.seeking ? 'Budget:' : 'Rent:'} ${item.budget}/${item.payment_type || ''}`}{' '}
						</Box>
					</Flex>
				</Stack>
			</Card>
		</Flex>
	)
}
