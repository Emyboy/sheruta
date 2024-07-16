import { DEFAULT_PADDING } from '@/configs/theme'
import { db } from '@/firebase'
import { DBCollectionName } from '@/firebase/service/index.firebase'
import { LocationKeywordData } from '@/firebase/service/options/location-keywords/location-keywords.types'
import { StateData } from '@/firebase/service/options/states/states.types'
import { Button, Flex, Input, Select, Text, VStack } from '@chakra-ui/react'
import {
	collection,
	DocumentReference,
	getDocs,
	query,
	where,
} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'

export default function LocationKeywordForm({ done }: { done: () => void }) {
	const [isLoading, setIsLoading] = useState(false)

	const [states, setStates] = useState<StateData[]>([])
	const [keywords, setKeywords] = useState<LocationKeywordData[]>([])

	const [stateRef, setStateRef] = useState<DocumentReference | null>(null)
	const [locationRef, setLocationRef] = useState<DocumentReference | null>(null)

	const fetchStates = async () => {
		setIsLoading(true)
		try {
			const querySnapshot = await getDocs(
				collection(db, DBCollectionName.states),
			)
			const statesList = querySnapshot.docs.map(
				(doc) =>
					({
						id: doc.id,
						...doc.data(),
					}) as StateData,
			)
			console.log('ALL STATES:::', statesList)
			setStates(statesList)
		} catch (err) {
			console.error('Error fetching states:', err)
		} finally {
			setIsLoading(false)
		}
	}

	const fetchKeywords = async () => {
		setIsLoading(true)
		try {
			const q = query(
				collection(db, DBCollectionName.locationKeyWords),
				where('_state_ref', '==', stateRef),
			)
			const querySnapshot = await getDocs(q)
			const keywordsList = querySnapshot.docs.map(
				(doc) =>
					({
						id: doc.id,
						...doc.data(),
					}) as LocationKeywordData,
			)
			setKeywords(keywordsList)
		} catch (err) {
			console.error('Error fetching location keywords:', err)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchStates()
	}, [])

	return (
		<>
			<Flex
				//   onSubmit={update}
				flexDir={'column'}
				justifyContent={'center'}
				alignItems={'center'}
				as={'form'}
			>
				<br />
				<br />
				<Text textAlign={'center'} as={'h1'} fontSize={'3xl'}>
					Set interested location
				</Text>
				<Text textAlign={'center'} color={'dark_lighter'}>
					Get discovered by people in your preferred location
				</Text>
				<br />
				<br />
				<VStack mb={3} w={'full'}>
					<Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={2}
						>
							<Text color={'text_muted'} fontSize={'sm'}>
								State
							</Text>
							<Select placeholder="Select state" bg="dark">
								{states.map((state) => {
									return (
										<option
											key={state.id}
											value={state.name.toLocaleLowerCase()}
										>
											{state.name}
										</option>
									)
								})}
							</Select>
						</Flex>
					</Flex>
					{locationRef && (
						<Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
							<Flex
								justifyContent={'flex-start'}
								flexDir={'column'}
								w="full"
								gap={2}
							>
								<Text color={'text_muted'} fontSize={'sm'}>
									Area
								</Text>
								<Select placeholder="Select area" bg="dark">
									{states.map((state) => {
										return (
											<option
												key={state.id}
												value={state.name.toLocaleLowerCase()}
											>
												{state.name}
											</option>
										)
									})}
								</Select>
							</Flex>
						</Flex>
					)}
				</VStack>
				<br />
				<Button type={'submit'} isLoading={isLoading}>{`Next`}</Button>
			</Flex>
		</>
	)
}
