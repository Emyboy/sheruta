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
// import { useEffect, useState } from 'react'
import { DocumentReference, getDoc } from 'firebase/firestore'

const ProfileSnippet = () => {
	const { authState } = useAuthContext()

	// const [area, setArea] = useState('')
	// const [state, setState] = useState('')

	// let locationValue: any = null

	// 		try {
	// 			const locationKeywordDocRef =
	// 				authState.flat_share_profile?.location_keyword as DocumentReference

	// 			const docSnapshot = await getDoc(locationKeywordDocRef)

	// 			if (docSnapshot.exists()) {
	// 				locationValue = docSnapshot.data()

	//                 setArea(locationValue)
	// 			} else {
	// 				console.log('Location keyword document does not exist.')
	// 			}
	// 		} catch (error) {
	// 			console.error('Error fetching Location keyword document:', error)
	// 		}

	// 		let stateValue: any = null

	// 		try {
	// 			const stateDocRef =
	// 				authState.flat_share_profile?.state as DocumentReference

	// 			const docSnapshot = await getDoc(stateDocRef)

	// 			if (docSnapshot.exists()) {
	// 				stateValue = docSnapshot.data()
	//                 setState(stateValue)
	// 			} else {
	// 				console.log('state document does not exist.')
	// 			}
	// 		} catch (error) {
	// 			console.error('Error fetching state document ref:', error)
	// 		}

	return (
		<>
			<Link>
				<Box m={4}>
					<Card
						direction={{ base: 'column', sm: 'row' }}
						overflow="hidden"
						variant="outline"
					>
						<Image
							objectFit="cover"
							maxW={{ base: '100%', sm: '200px' }}
							src={authState.user?.avatar_url}
							alt="Caffe Latte"
						/>

						<Stack>
							<CardBody mb={0} border="none">
								{/* <Heading size='md'>The perfect latte</Heading> */}
								<Flex justify="space-between" align="center" mb={3}>
									<Text>{`${authState.user?.first_name} ${authState.user?.last_name}`}</Text>
									<Badge color="text_color" background="border_color">
										Promoted
									</Badge>
								</Flex>

								<Flex>
									<Text py="2">
										Caffè latte is a coffee beverage of Italian origin made with
										espresso and steamed milk.
									</Text>
								</Flex>

								<Flex
									style={{ fontSize: '10px' }}
									justify="space-between"
									align="center"
								>
									<Text color="text_muted">
										{`Preffered area:${authState.flat_share_profile?.location_keyword} Lagos`}
									</Text>
									<Badge
										colorScheme="green"
										rounded="md"
										textTransform={'capitalize'}
									>
										{`I have a space`}
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
							<Divider />
							<Flex justify="space-between" align="center" mb={2}>
								<Button colorScheme="lueb" color="text_muted">
									<BiBookmark style={{ fontSize: '1.5em' }} />
								</Button>
								<Box mr={2} color="text_muted">
									Budget: N600,000/month
								</Box>
							</Flex>
						</Stack>
					</Card>
				</Box>
				<Divider />
			</Link>
		</>
	)
}

export default ProfileSnippet
