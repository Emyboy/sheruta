import Confetti from 'react-confetti'
import React, { useEffect, useState } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { getDoc, getDocs, where, query, collection, DocumentReference, DocumentSnapshot } from 'firebase/firestore'
import { DBCollectionName } from '@/firebase/service/index.firebase'
import { db } from '@/firebase'
import { useAuthContext } from '@/context/auth.context'


export default function GetStartedCompleted({ done }: { done: () => void }) {
	const [width, setWidth] = useState(100)
	const [height, setHeight] = useState(400)
	const [run, setRun] = useState(true)

	const {authState: { user}} = useAuthContext()


	
	const getAllProfileData = async () => {
		try {
		  const [flatShareProfileDocs, userInfoDocs] = await Promise.all([
			getDocs(
			  query(
				collection(db, DBCollectionName.flatShareProfile),
				where('_user_id', '==', user?._id)
			  )
			),
			getDocs(
			  query(
				collection(db, DBCollectionName.userInfos),
				where('_user_id', '==', user?._id)
			  )
			),
		  ]);

		  const flatShareProfile = flatShareProfileDocs.docs[0]?.data() || null;
		  const userInfo = userInfoDocs.docs[0]?.data() || null;

		  console.log('thisi is the flatshare in hetflatshre.......................',flatShareProfile)
	  
		  if (!flatShareProfile) return { flatShareProfile: null, userInfo: null };
	  
		  
			let interestsData: any = []

			try {
				if (flatShareProfile?.interests) {
					const arrayDocRef =
					flatShareProfile.interests as DocumentReference[]

					const docSnapshots = await Promise.all(
						arrayDocRef.map((docRef) => getDoc(docRef)),
					)

					interestsData = docSnapshots
						.map((docSnapshot: DocumentSnapshot) =>
							docSnapshot.exists() ? docSnapshot.data() : null,
						)
						.filter((data) => data !== null)
				}
			} catch (error) {
				console.error('Error fetching interests:', error)
			}

			let habitsData: any = []

			try {
				if (flatShareProfile?.habits) {
					const arrayDocRef =
					flatShareProfile.habits as DocumentReference[]

					const docSnapshots = await Promise.all(
						arrayDocRef.map((docRef) => getDoc(docRef)),
					)
					habitsData = docSnapshots
						.map((docSnapshot: DocumentSnapshot) =>
							docSnapshot.exists() ? docSnapshot.data() : null,
						)
						.filter((data) => data !== null)
				}
			} catch (error) {
				console.error('Error fetching habits:', error)
			}

			let locationValue: any = null

			try {
				const locationKeywordDocRef =
				flatShareProfile?.location_keyword as DocumentReference

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
				const stateDocRef =
				flatShareProfile?.state as DocumentReference

				const docSnapshot = await getDoc(stateDocRef)

				if (docSnapshot.exists()) {
					stateValue = docSnapshot.data()
				} else {
					console.log('state document does not exist.')
				}
			} catch (error) {
				console.error('Error fetching state document ref:', error)
			}
		
		  return { flatShareProfile, userInfo };
		} catch (error) {
		  console.error("Error fetching profile data: ", error);
		  throw error;
		}
	  };

	  const profileData = getAllProfileData()
	  console.log(profileData)


	  

	useEffect(() => {
		if (typeof window !== undefined) {
			setHeight(window.innerHeight)
			setWidth(window.innerWidth)
			setTimeout(() => {
				setRun(false)
				setTimeout(() => {
					window.location.reload()
				}, 2000)
			}, 4000)
		}
	}, [])

	return (
		<>
			<Flex
				mt={{
					base: '30rem',
					md: '10px',
				}}
				flexDir={'column'}
				justifyContent={'center'}
				alignItems={'center'}
			>
				<Text
					textAlign={'center'}
					as={'h1'}
					fontSize={'3xl'}
					className={'animate__animated animate__fadeInUp animate__faster'}
				>
					{`Congratulation 🎉`}
				</Text>
				<Text
					textAlign={'center'}
					color={'dark_lighter'}
					className={'animate__animated animate__fadeInUp'}
				>
					{`Welcome to the Sheruta community`}
				</Text>
				<Confetti
					width={width}
					height={height}
					numberOfPieces={run ? 200 : 0}
				/>
			</Flex>
		</>
	)
}
