import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Image,
	Stack,
	Heading,
	Text,
	Button,
	Divider,
	Box,
	Flex,
	Badge,
	Link,
} from '@chakra-ui/react'
import { BiBookmark } from 'react-icons/bi'
import { useAuthContext } from '@/context/auth.context'
import { DocumentReference, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'

type Props = {
	userProfiles: any
}
const ProfileSnippet = ({ userProfiles }: Props) => {
	const [snippetData, setSnippetData] = useState<Record<string, any>>({})
	const { authState } = useAuthContext()

	useEffect(() => {
		const fetchData = async () => {
			let locationValue: any = null

			try {
				const locationKeywordDocRef = authState.flat_share_profile
					?.location_keyword as DocumentReference

				const docSnapshot = await getDoc(locationKeywordDocRef)

				if (docSnapshot.exists()) {
					locationValue = docSnapshot.data()
				} else {
					console.log('Location keyword document does not exist.')
				}
			} catch (error) {
				console.error('Error fetching Location keyword document:', error)
			}

			let stateValue: any = null

			try {
				const stateDocRef = authState.flat_share_profile
					?.state as DocumentReference

				const docSnapshot = await getDoc(stateDocRef)

				if (docSnapshot.exists()) {
					stateValue = docSnapshot.data()
				} else {
					console.log('state document does not exist.')
				}
			} catch (error) {
				console.error('Error fetching state document ref:', error)
			}

			const profileSnippetData = {
				firstName: authState.user?.first_name,
				lastName: authState.user?.last_name,
				bio: authState.flat_share_profile?.bio,
				state: stateValue ? stateValue.name : null,
				area: locationValue ? locationValue.name : null,
				seeking: authState.flat_share_profile?.seeking,
				budget: authState.flat_share_profile?.budget,
			}

			setSnippetData(profileSnippetData)
		}
		fetchData()
	}, [authState])

	interface UserProfile {
		collection_name: string

		twitter: string
		employment_status: string
		state: string
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
		area: string
		bio: string
		_id: string
		budget: number
		payment_plan: string
		service_type: string
	}

	const parsedUserProfile: UserProfile[] = JSON.parse(userProfiles)

	return null
	return (
		<>
			{parsedUserProfile.length > 0 ? (
				parsedUserProfile.map((item, index) => {
					const ProfileSnippetBio = item?.bio
					const maxBioLength = 84

					return (
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
									src={`${item?.avatar_url}`}
									alt="Profile Image"
								/>

								<Stack>
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
													{`Preferred area: ${item.area} ,${item.state}`}{' '}
												</Text>
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
						</Box>
					)
				})
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
