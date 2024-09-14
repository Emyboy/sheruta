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

const ProfileSnippet = () => {
	const [snippetData, setSnippetData] = useState<Record<string, any>>({})
	const { authState } = useAuthContext()

	// console.log('PROFILE SNIPPET 1:....................', authState.user)
	useEffect(() => {
		// console.log('PROFILE SNIPPET 2:....................', authState.user)
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

	console.log('snippet data:.............', snippetData)

	const ProfileSnippetBio = snippetData?.bio
	const maxBioLength = 84

	return (
		<>
			<Box m={4}>
				<Card
					direction={{ base: 'column', sm: 'row' }}
					overflow="hidden"
					variant="outline"
				>
					<Image
						objectFit="cover"
						maxW={{ base: '100%', sm: '200px' }}
						w="600px"
						src={`${authState.user?.avatar_url}`}
						alt="Caffe Latte"
					/>

					<Stack>
						<Link
							href={`/user/${authState.user?._id}`}
							style={{ textDecoration: 'none' }}
						>
							<CardBody mb={0} border="none">
								{/* <Heading size='md'>The perfect latte</Heading> */}
								<Flex justify="space-between" align="center" mb={3}>
									<Text>{`${authState.user?.first_name} ${authState.user?.last_name}`}</Text>
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
										{`Preffered area: ${snippetData?.area} ,${snippetData?.state}`}
									</Text>
									<Badge
										colorScheme={snippetData?.is_seeking ? 'cyan' : 'green'}
										rounded="md"
										textTransform="capitalize"
									>
										{snippetData?.is_seeking ? 'Seeker' : 'I have a space'}
									</Badge>
									<Badge
										colorScheme="orange"
										rounded="md"
										textTransform={'capitalize'}
									>
										{`House share`}
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
								{`Budget: ${snippetData?.budget}/month`}
							</Box>
						</Flex>
					</Stack>
				</Card>
			</Box>
			<Divider />
		</>
	)
}

export default ProfileSnippet
