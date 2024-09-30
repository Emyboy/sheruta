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
import { useRouter } from 'next/navigation'
import React from 'react'
import { BiBookmark } from 'react-icons/bi'
import { TbCircleLetterX } from 'react-icons/tb'

type Props = {
	userProfiles: any
}

interface UserProfile {
	collection_name: string
	twitter: string
	employment_status: string
	state: any
	phone_number: string
	linkedin: string
	work_industry: string
	instagram: string
	seeking: boolean
	document_id: string
	religion: string
	avatar_url: string
	first_name: string
	last_name: string
	email: string
	area: any
	bio: string
	_id: string
	budget: number
	payment_plan: string
	service_type: string
	_user_ref: any
}

const ProfileSnippet = ({ userProfiles }: Props) => {
	const parsedUserProfile: UserProfile[] = JSON.parse(userProfiles)
	const router = useRouter()

	return (
		<React.Fragment>
			<Button
				w={'100%'}
				gap={2}
				mb={'-1rem'}
				p={0}
				pr={3}
				justifyContent={'end'}
				fontSize={{ base: 'sm', md: 'base' }}
				fontWeight={300}
				color={'brand'}
				bgColor={'transparent'}
				_hover={{ bgColor: 'transparent', textDecoration: 'none' }}
				onClick={() => router.push('/')}
			>
				Clear Filters
				<TbCircleLetterX size={'16px'} />
			</Button>

			{parsedUserProfile.length > 0 ? (
				parsedUserProfile.map((item, index) => {
					const ProfileSnippetBio = item?.bio
					const maxBioLength = 84

					return (
						<Flex m={4} key={index}>
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
									src={`${item.avatar_url}`}
									alt="Profile Image"
								/>

								<Stack w={'100%'}>
									<Link
										href={`/user/${item?.document_id}`}
										style={{ textDecoration: 'none' }}
									>
										<CardBody mb={0} border="none">
											<Flex justify="space-between" align="center" mb={3}>
												<Text>{`${item?.first_name} ${item.last_name}`}</Text>
												<Badge color="text_color" background="border_color">
													Promoted
												</Badge>
											</Flex>

											<Flex>
												<Text color="muted_text" py="2" fontSize="0.8em">
													{ProfileSnippetBio
														? ProfileSnippetBio.length > maxBioLength
															? `${ProfileSnippetBio.substring(0, maxBioLength)}......`
															: ProfileSnippetBio
														: 'Hi! I am a user of Sheruta, you should go through my profile and see if we are a match'}
												</Text>
											</Flex>

											<Flex
												style={{ fontSize: '10px' }}
												justify="space-between"
												align="center"
											>
												<Text color="text_muted" fontWeight="700">
													{`Preferred area: ${item.area.name}, ${item.state.name}`}{' '}
												</Text>
												{/* <Badge
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
									<Flex justify="space-between" align="center" mb={2}>
										<Button colorScheme="lueb" color="text_muted">
											<BiBookmark style={{ fontSize: '1.5em' }} />
										</Button>
										<Box mr={2} color="text_muted">
											{`${item.seeking ? 'Budget:' : 'Rent:'} ${item.budget}/${item.payment_plan ? item?.payment_plan : ''}`}{' '}
										</Box>
									</Flex>
								</Stack>
							</Card>
						</Flex>
					)
				})
			) : (
				<Box>
					<Text w={'100%'} textAlign={'center'} fontWeight={600} my={4}>
						No profiles found
					</Text>
				</Box>
			)}

			<Divider />
		</React.Fragment>
	)
}

export default ProfileSnippet
