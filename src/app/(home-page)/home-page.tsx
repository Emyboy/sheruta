'use client'

import EachRequest from '@/components/EachRequest/EachRequest'
import JoinTheCommunity from '@/components/ads/JoinTheCommunity'
import SpaceSkeleton from '@/components/atoms/SpaceSkeleton'
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
import { Box, Flex, Text, Spinner } from '@chakra-ui/react'
import ProfileSnippet from '@/components/ads/ProfileSnippet'
import {
	collection,
	DocumentData,
	DocumentReference,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
} from 'firebase/firestore'

import { useEffect, useRef, useState } from 'react'
import HomeTabs from './HomeTabs'
import { HostRequestDataDetails } from '@/firebase/service/request/request.types'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import { resolveArrayOfReferences } from '@/utils/index.utils'
import { getAllProfileSnippetDocs } from '@/firebase/service/userProfile/user-profile'

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

	const [processedRequests, setProcessedRequests] = useState<
		HostRequestDataDetails[]
	>([])

	useEffect(() => {
		const processRequests = async () => {
			if (flatShareRequests.length > 0) {
				const updatedRequests = await Promise.all(
					flatShareRequests.map(async (request: HostRequestDataDetails) =>
						request.user_info?.hide_profile ? null : { ...request },
					),
				)

				const filteredRequests = updatedRequests.filter(Boolean)
				setProcessedRequests(filteredRequests as HostRequestDataDetails[])
			}
		}

		processRequests()
	}, [flatShareRequests])

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
				// Extract new requests from the querySnapshot
				const newRequests = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				})) as HostRequestDataDetails[]

				// Resolve any document references in the new requests
				const resolvedRequests = await resolveArrayOfReferences(newRequests)

				// Further resolve user information and filter out hidden profiles
				const resolvedNewRequests = await Promise.all(
					resolvedRequests
						?.filter(
							(request: HostRequestDataDetails) => request?._user_ref?._id,
						)
						.map(async (request: HostRequestDataDetails) => {
							const userId = request._user_ref._id
							const user_info = await UserInfoService.get(userId)

							// Only include requests where the user profile is not hidden
							if (!user_info?.hide_profile) {
								return {
									...request,
									user_info,
								}
							}

							// Return null if the user profile is hidden
							return null
						}),
					// Filter out any null results from hidden profiles
				).then((results) => results.filter((request) => request !== null))

				// Update state with filtered new requests (removing duplicates)
				setFlatShareRequests((prevRequests) => {
					const existingIds = new Set(prevRequests.map((request) => request.id))

					// Filter out new requests that already exist in previous requests
					const filteredNewRequests = resolvedNewRequests.filter(
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
						<Flex flexDirection={'column'} gap={0}>
							{processedRequests.map((request: any, index: number) => (
								<Box
									key={request.id}
									ref={index === processedRequests.length - 1 ? setRef : null}
									style={{ transition: 'opacity 0.3s ease-in-out' }}
								>
									{index === 3 && <JoinTheCommunity key={index} />}
									<Flex px={DEFAULT_PADDING}>
										<EachRequest request={request} />
									</Flex>
								</Box>
							))}

							{isLoading && processedRequests.length > 0 && (
								<Box textAlign="center" mt="4" width="100%">
									<Spinner size="xl" />
									<Text mt="4">Loading more posts...</Text>
								</Box>
							)}

							{!processedRequests.length &&
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
