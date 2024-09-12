'use client'

import EachRequest from '@/components/EachRequest/EachRequest'
import JoinTheCommunity from '@/components/ads/JoinTheCommunity'
import SpaceSkeleton from '@/components/atoms/SpaceSkeleton'
import Spinner from '@/components/atoms/Spinner'
import MainHeader from '@/components/layout/MainHeader'
import MainLeftNav from '@/components/layout/MainLeftNav'
import MainPageBody from '@/components/layout/MainPageBody'
import MainRightNav from '@/components/layout/MainRightNav'
import MobileNavFooter from '@/components/layout/MobileNavFooter'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { DEFAULT_PADDING } from '@/configs/theme'
import { db } from '@/firebase'
import { DBCollectionName } from '@/firebase/service/index.firebase'
import { StateData } from '@/firebase/service/options/states/states.types'
import { Box, Flex, Text } from '@chakra-ui/react'
import {
	collection,
	DocumentData,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
} from 'firebase/firestore'

import { useEffect, useRef, useState } from 'react'
import HomeTabs from './HomeTabs'
import ProfileSnippet from '@/components/ads/ProfileSnippet'

type Props = {
	locations: string
	states: StateData[]
	requests: string
}

export default function HomePage({ locations, states, requests }: Props) {
	const [flatShareRequests, setFlatShareRequests] = useState<any[]>(
		requests ? JSON.parse(requests) : [],
	)
	const [isLoading, setIsLoading] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [lastVisible, setLastVisible] = useState<DocumentData | null>(null) // Store the last document

	const lastRequestRef = useRef<HTMLDivElement | null>(null)
	const observer = useRef<IntersectionObserver | null>(null)

	const loadMore = async () => {
		setIsLoading(true)
		try {
			const requestsRef = collection(db, DBCollectionName.flatShareRequests)
			let requestsQuery = query(requestsRef, orderBy('updatedAt'), limit(10))

			if (lastVisible) {
				requestsQuery = query(requestsQuery, startAfter(lastVisible))
			}

			const querySnapshot = await getDocs(requestsQuery)

			if (querySnapshot.empty) {
				setHasMore(false)
			} else {
				const newRequests = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}))

				setFlatShareRequests((prevRequests) => {
					const existingIds = new Set(prevRequests.map((request) => request.id))

					const filteredNewRequests = newRequests.filter(
						(request) => !existingIds.has(request.id),
					)

					return [...prevRequests, ...filteredNewRequests]
				})

				setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]) // Update last visible document
			}
		} catch (error) {
			console.error('Failed to load more data', error)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (isLoading) return

		if (observer.current) observer.current.disconnect()

		observer.current = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && hasMore) {
				loadMore()
			}
		})

		if (lastRequestRef.current) observer.current.observe(lastRequestRef.current)

		return () => {
			if (observer.current) observer.current.disconnect()
		}
	}, [isLoading, hasMore, lastRequestRef])

	// Assign ref to the last item
	const setRef = (node: HTMLDivElement | null) => {
		if (observer.current) observer.current.disconnect()
		lastRequestRef.current = node
		if (node) observer.current?.observe(node)
	}

	useEffect(() => {
		const parsedRequests: [] = requests ? JSON.parse(requests) : []
		if (parsedRequests.length > 0) {
			setFlatShareRequests([...parsedRequests])
		}
	}, [requests])

	return (
		<>
			<MainPageBody>
				<ThreeColumnLayout header={<MainHeader />}>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>
					<Flex flexDir={'column'}>
						<HomeTabs locations={JSON.parse(locations)} states={states} />
						<JoinTheCommunity />
						<ProfileSnippet />

						<Flex flexDirection={'column'} gap={0}>
							{flatShareRequests.map((request: any, index: number) => (
								<Box
									key={request.id}
									ref={index === flatShareRequests.length - 1 ? setRef : null}
									style={{ transition: 'opacity 0.3s ease-in-out' }}
								>
									{index === 3 && <JoinTheCommunity key={index} />}
									<Flex px={DEFAULT_PADDING}>
										<EachRequest request={request} />
									</Flex>
								</Box>
							))}

							{isLoading && flatShareRequests.length > 0 && (
								<Flex justify="center" mt="3">
									<Spinner />
								</Flex>
							)}

							{!flatShareRequests.length &&
								isLoading &&
								Array.from({ length: 4 }).map((_, index) => (
									<SpaceSkeleton key={index} />
								))}

							{!hasMore && (
								<Box mt={3}>
									<Text align={'center'}>
										You have reached the end of our listing.
									</Text>
								</Box>
							)}
						</Flex>
					</Flex>
					<Flex>
						<MainRightNav />
					</Flex>
				</ThreeColumnLayout>
				<MobileNavFooter />
			</MainPageBody>
		</>
	)
}
