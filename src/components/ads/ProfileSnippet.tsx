import { DEFAULT_PADDING } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
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
import { DocumentReference, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { BiBookmark } from 'react-icons/bi'

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
}

const ProfileSnippet = ({ userProfiles }: Props) => {
	// const [snippetData, setSnippetData] = useState<Record<string, any>>({})
	// const { authState } = useAuthContext()

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		let locationValue: any = null

	// 		try {
	// 			const locationKeywordDocRef = authState.flat_share_profile
	// 				?.location_keyword as DocumentReference

	// 			const docSnapshot = await getDoc(locationKeywordDocRef)

	// 			if (docSnapshot.exists()) {
	// 				locationValue = docSnapshot.data()
	// 			} else {
	// 				console.log('Location keyword document does not exist.')
	// 			}
	// 		} catch (error) {
	// 			console.error('Error fetching Location keyword document:', error)
	// 		}

	// 		let stateValue: any = null

	// 		try {
	// 			const stateDocRef = authState.flat_share_profile
	// 				?.state as DocumentReference

	// 			const docSnapshot = await getDoc(stateDocRef)

	// 			if (docSnapshot.exists()) {
	// 				stateValue = docSnapshot.data()
	// 			} else {
	// 				console.log('state document does not exist.')
	// 			}
	// 		} catch (error) {
	// 			console.error('Error fetching state document ref:', error)
	// 		}

	// 		const profileSnippetData = {
	// 			firstName: authState.user?.first_name,
	// 			lastName: authState.user?.last_name,
	// 			bio: authState.flat_share_profile?.bio,
	// 			state: stateValue ? stateValue.name : null,
	// 			area: locationValue ? locationValue.name : null,
	// 			seeking: authState.flat_share_profile?.seeking,
	// 			budget: authState.flat_share_profile?.budget,
	// 		}

	// 		setSnippetData(profileSnippetData)
	// 	}
	// 	fetchData()
	// }, [authState])

	const parsedUserProfile: UserProfile[] = JSON.parse(userProfiles)

	// return null
	return (
		<>
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
		</>
	)
}

export default ProfileSnippet
