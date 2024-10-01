import { DEFAULT_PADDING } from '@/configs/theme'
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

export interface UserProfile {
	state: any
	_user_id: string
	seeking: boolean
	bio: string
	budget: number
	payment_type: string
	_user_ref: any
	location_keyword: any
	done_kyc: boolean
}

export default function SearchProfileCard({
	profile,
}: {
	profile: UserProfile
}) {
	if (!profile.done_kyc) return null
	return (
		<Flex m={4} w={'100%'}>
			<Card
				direction={{ base: 'column', sm: 'row' }}
				overflow="hidden"
				variant="outline"
				w={'100%'}
			>
				<Image
					objectFit="cover"
					src={profile._user_ref.avatar_url || '/assets/avatar.webp'}
					alt="Profile Image"
					maxW={{ base: '100%', sm: '200px' }}
					w="600px"
					h={'100%'}
				/>

				<Stack w={'100%'}>
					<Link
						href={`/user/${profile._user_id}`}
						style={{ textDecoration: 'none' }}
					>
						<CardBody mb={0} border="none">
							<Flex justify="space-between" align="center" mb={3}>
								<Text>{`${profile._user_ref.first_name} ${profile._user_ref.last_name}`}</Text>
							</Flex>

							<Flex>
								<Text color="muted_text" pb={2} fontSize="0.8em">
									{profile.bio
										? profile.bio.length > 84
											? `${profile.bio.substring(0, 84)}......`
											: profile.bio
										: 'Hi! I am a user of Sheruta, you should go through my profile and see if we are a match'}
								</Text>
							</Flex>

							<Flex
								style={{ fontSize: '12px' }}
								justify="space-between"
								align="center"
							>
								<Text color="text_muted" fontWeight="700">
									{`Preferred area: ${profile.location_keyword.name}, ${profile.state.name}`}{' '}
								</Text>
								{/* <Badge
													colorScheme="green"
													rounded="md"
													textTransform="capitalize"
												>
													{profile.service_type}
												</Badge>
												<Badge
													colorScheme={profile.seeking ? 'orange' : 'teal'}
													textTransform="capitalize"
												>
													{profile?.seeking ? 'Seeker' : 'I have a space'}
												</Badge> */}
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
									{profile.payment_type}
								</Badge>
								<Badge
									colorScheme={profile.seeking ? 'orange' : 'teal'}
									textTransform="capitalize"
								>
									{profile.seeking ? 'Seeker' : 'I have a space'}
								</Badge>
							</Flex>
						</CardBody>
					</Link>
					<Divider />
					<Flex gap={1} align="center" mt={'auto'} mb={2}>
						<Button colorScheme="lueb" color="text_muted">
							<BiBookmark style={{ fontSize: '1.5em' }} />
						</Button>
						<Box pr={1} color="text_muted">
							{`${profile.seeking ? 'Budget:' : 'Rent:'} ${profile.budget}/${profile.payment_type}`}
						</Box>
					</Flex>
				</Stack>
			</Card>
		</Flex>
	)
}
