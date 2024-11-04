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
import { PromotedUserProfiles } from '@/firebase/service/userProfile/user-profile-types'

type Props = {
	userProfiles: PromotedUserProfiles[]
}
const ProfileSnippet = ({ userProfiles }: Props) => {
	// const params = useSearchParams()
	// const router = useRouter()

	return (
		<>
			{userProfiles.length > 0 ? (
				userProfiles.map((item, index) => (
					<Box m={4} key={index}>
						<Card
							direction={{ base: 'column', sm: 'row' }}
							overflow="hidden"
							variant="outline"
						>
							<Image
								objectFit="cover"
								maxW={{ base: '100%', sm: '200px' }}
								w="600px"
								src={`${item.user.avatar_url}`}
								alt="Profile Image"
							/>

							<Stack>
								<Link
									href={`/user/${item._id}`}
									style={{ textDecoration: 'none' }}
								>
									<CardBody mb={0} border="none">
										<Flex justify="space-between" align="center" mb={3}>
											<Text>{`${item?.user.first_name} ${item.user.last_name}`}</Text>
											<Badge color="text_color" background="border_color">
												Promoted
											</Badge>
										</Flex>

										<Flex>
											<Text color="muted_text" py="2" fontSize="0.8em">
												{item?.pitch
													? item?.pitch.length > 84
														? `${item?.pitch.substring(0, 84)}......`
														: item?.pitch
													: 'Hi! I am a user of Sheruta, you should go through my profile and see if we are a match'}
											</Text>
										</Flex>

										<Flex
											style={{ fontSize: '10px' }}
											justify="space-between"
											align="center"
										>
											<Text color="text_muted" fontWeight="700">
												{`Preferred area: ${item.location.name} ,${item.state.name}`}{' '}
											</Text>
											<Badge
												colorScheme="green"
												rounded="md"
												textTransform="capitalize"
											>
												{item.service.name}
											</Badge>
											<Badge
												colorScheme={
													item.flat_share_profile.seeking ? 'orange' : 'teal'
												}
												textTransform="capitalize"
											>
												{item.flat_share_profile.seeking
													? 'Seeker'
													: 'I have a space'}
											</Badge>
										</Flex>
									</CardBody>
								</Link>
								<Divider />
								<Flex justify="space-between" align="center" mb={2}>
									<Button colorScheme="lueb" color="text_muted">
										<BiBookmark style={{ fontSize: '1.5em' }} />
									</Button>
									<Box mr={2} color="text_muted">
										{`${item.flat_share_profile.seeking ? 'Budget:' : 'Rent:'} ${item.flat_share_profile.budget}/${item.flat_share_profile.payment_type ? item?.flat_share_profile.payment_type : ''}`}
									</Box>
								</Flex>
							</Stack>
						</Card>
					</Box>
				))
			) : (
				<Box>
					<Text>Feature your profile here.</Text>
				</Box>
			)}

			<Divider />
		</>
	)
}

export default ProfileSnippet
