'use client'

import EachRequest from '@/components/EachRequest/EachRequest'
import JoinTheCommunity from '@/components/ads/JoinTheCommunity'
import ProfileSnippet from '@/components/ads/ProfileSnippet'
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
import { HostRequestDataDetails } from '@/firebase/service/request/request.types'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import { resolveArrayOfReferences } from '@/utils/index.utils'
import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
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
import { useMutation, useQuery } from '@tanstack/react-query'
import useAuthenticatedAxios from '@/hooks/useAxios'
import { User } from 'firebase/auth'

type Props = {
	requests: string
	userProfiles: any
}

export default function HomePage({ requests, userProfiles }: Props) {
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
	// const axiosAuth = useAuthenticatedAxios()

	// const { data, isLoading, isError, error, refetch } = useQuery({
	// 	queryKey: ["testing", ],
	// 	queryFn: () => axiosAuth.get(`/route`),
	// 	refetchOnWindowFocus: false,
	// })

	// const {mutate, isPending} = useMutation({
	// 	mutationFn: (user:User) => axiosAuth.post(`/route`, { ...data }),
	// 	onSuccess: () =>
	// 	{
	// 		// what to do when

	// 		toast({
	// 			message:"user infor update"
	// 		})

	// 	},
	// 	onError:(error)=>{
	// 		console.log(error)
	// 	}
	// })

	useEffect(() => {
		const processRequests = async () => {
			if (flatShareRequests.length > 0) {
				const updatedRequests = await Promise.all(
					flatShareRequests.map(async (request: HostRequestDataDetails) =>
						request._user_info_ref?.hide_profile ? null : { ...request },
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

				// Update state with filtered new requests (removing duplicates)
				setFlatShareRequests((prevRequests) => {
					const existingIds = new Set(prevRequests.map((request) => request.id))

					// Filter out new requests that already exist in previous requests
					const filteredNewRequests = resolvedRequests.filter(
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

	// const handleSubmit = (values) =>
	// {
	// 	/**
	// 	 * username:daniel,
	// 	 * _id:7386yihsdf8
	// 	 */
	// 	mutate(values)
	// }

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
						<HomeTabs />
						<JoinTheCommunity />
						<ProfileSnippet userProfiles={userProfiles} />

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
