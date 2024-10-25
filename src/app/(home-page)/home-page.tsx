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
import { FlatShareRequest } from '@/firebase/service/request/request.types'
import { unAuthenticatedAxios } from '@/utils/custom-axios'
import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import HomeTabs from './HomeTabs'

type Props = {
	requests: FlatShareRequest[] | undefined
	userProfiles: any
}

export default function HomePage({ requests, userProfiles }: Props) {
	const [flatShareRequests, setFlatShareRequests] = useState<
		FlatShareRequest[]
	>(requests ? requests : [])
	const [isLoading, setIsLoading] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [page, setPage] = useState(1)

	const lastRequestRef = useRef<HTMLDivElement | null>(null)
	const observer = useRef<IntersectionObserver | null>(null)

	const [processedRequests, setProcessedRequests] = useState<
		FlatShareRequest[]
	>([])

	useEffect(() => {
		const processRequests = async () => {
			if (flatShareRequests.length > 0) {
				const updatedRequests = await Promise.all(
					flatShareRequests.map(async (request: FlatShareRequest) =>
						request.user_info?.hide_profile ? null : { ...request },
					),
				)
				const filteredRequests = updatedRequests.filter(Boolean)
				setProcessedRequests(filteredRequests as FlatShareRequest[])
			}
		}

		processRequests()
	}, [flatShareRequests])

	const loadMore = async () => {
		setIsLoading(true)

		try {
			const {
				data: { data: requests },
			}: {
				data: { data: FlatShareRequest[] }
			} = await unAuthenticatedAxios.get(
				`/flat-share-requests?page=${page}&limit=10`,
			)

			if (requests && requests?.length === 0) {
				setHasMore(false) // No more data to load
			} else {
				// Filter out duplicates
				setFlatShareRequests((prevRequests) => {
					const existingIds = new Set(prevRequests.map((req) => req._id))

					// Filter out requests that already exist
					const newRequests = requests.filter(
						(request) => !existingIds.has(request._id),
					)

					return [...prevRequests, ...newRequests]
				})

				setPage((prevPage) => prevPage + 1) // Increment the page number
			}
		} catch (error) {
			console.error('Failed to load more data', error)
		} finally {
			setIsLoading(false)
		}
	}

	// Infinite scroll effect using IntersectionObserver
	useEffect(() => {
		if (isLoading) return
		if (observer.current) observer.current.disconnect()

		observer.current = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && hasMore) {
				loadMore()
			}
		})

		if (lastRequestRef.current) {
			observer.current.observe(lastRequestRef.current)
		}

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
						<HomeTabs />
						<JoinTheCommunity />
						<ProfileSnippet userProfiles={userProfiles} />

						<Flex flexDirection={'column'} gap={0}>
							{processedRequests.map(
								(request: FlatShareRequest, index: number) => (
									<Box
										key={request._id}
										ref={index === processedRequests.length - 1 ? setRef : null}
										style={{ transition: 'opacity 0.3s ease-in-out' }}
									>
										{index === 3 && <JoinTheCommunity key={index} />}
										<Flex px={DEFAULT_PADDING}>
											<EachRequest request={request} />
										</Flex>
									</Box>
								),
							)}

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
					{/* <Flex>
						<MainRightNav />
					</Flex> */}
				</ThreeColumnLayout>
				<MobileNavFooter />
			</MainPageBody>
		</>
	)
}
