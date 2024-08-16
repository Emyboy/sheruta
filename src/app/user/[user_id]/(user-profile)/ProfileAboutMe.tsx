import { DEFAULT_PADDING } from '@/configs/theme'
import { Badge, Flex, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { getDoc, DocumentReference, DocumentSnapshot } from 'firebase/firestore'

type Props = {
	data: any
}

export default function ProfileAboutMe({ data }: Props) {
	// const [userInterest, setUserInterests] = useState([])

	async function getInterestsData(interests: DocumentReference[]) {
		const interestsData = await Promise.all(
			interests.map(async (docRef) => {
				const docSnap = await getDoc(docRef)
				if (docSnap.exists()) {
					return docSnap.data()
				} else {
					console.log('No such document!')
					return null
				}
			}),
		)

		return interestsData.filter(Boolean) // Remove any null values
	}

	// Define an interface for your data structure
	interface UserData {
		interests: DocumentReference[]
		// ... other fields
	}

	// Assuming you have the data object
	const dataForInterests: UserData = {
		// ... other fields
		interests: data.flatShareProfile.interests,
		// ... other fields
	}

	//   console.log("Hope this works...............................", dataForInterests);

	let extractedInterestData: any

	// Usage
	async function fetchInterests() {
		getInterestsData(dataForInterests.interests)
			.then((interestsData) => {
				//   console.log("Interests data:", interestsData);
			})
			.catch((error: Error) => {
				console.error('Error fetching interests:', error)
			})
	}

	fetchInterests()

	// console.log("From the extracted data....",extractedInterestData)

	return (
		<Flex flexDirection={'column'} gap={DEFAULT_PADDING}>
			<Text>
				Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates
				placeat possimus cumque ab suscipit. Sequi porro beatae doloribus,
				accusamus repudiandae unde laborum tenetur eius soluta eos deserunt qui
				tempore officiis.
			</Text>
			<Flex flexWrap={'wrap'} gap={2}>
				{new Array(10).fill(null).map((_) => {
					return (
						<Badge
							key={Math.random()}
							bg="border_color"
							px={3}
							rounded={'md'}
							_dark={{
								color: 'border_color',
								bg: 'dark_light',
							}}
						>
							New f
						</Badge>
					)
				})}
			</Flex>
		</Flex>
	)
}
