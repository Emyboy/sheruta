'use client'

import Spinner from '@/components/atoms/Spinner'
import { useAuthContext } from '@/context/auth.context'
import { useOptionsContext } from '@/context/options.context'
import FlatShareProfileService from '@/firebase/service/flat-share-profile/flat-share-profile.firebase'
import { InterestData } from '@/firebase/service/options/options.types'
import useCommon from '@/hooks/useCommon'
import {
	Box,
	Button,
	VStack,
	Wrap,
	WrapItem,
	Text,
	Flex,
} from '@chakra-ui/react'
import { getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'

const InterestsForm = () => {
	const [isInterestsLoading, setIsInterestsLoading] = useState<boolean>(true)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const { showToast } = useCommon()

	const {
		optionsState: { interests },
	} = useOptionsContext()
	const {
		authState: { flat_share_profile },
	} = useAuthContext()

	const [interestsList, setInterestsList] = useState<InterestData[]>([])
	const [selectedInterests, setSelectedInterests] = useState<InterestData[]>([])

	const handleSelect = (interest: InterestData) => {
		setSelectedInterests((prev: InterestData[]) =>
			prev.some((h) => h.id === interest.id)
				? prev.filter((h) => h.id !== interest.id)
				: [...prev, interest],
		)
	}

	useEffect(() => {
		if (interests && flat_share_profile && flat_share_profile._user_id) {
			getAllInterests()
			setInterestsList(interests)
			return
		}
	}, [flat_share_profile, interests])

	const getAllInterests = async () => {
		try {
			setIsInterestsLoading(true)
			const documents: InterestData[] = []
			let refs = flat_share_profile?.interests as any[]

			if (refs && refs.length > 0) {
				for (const ref of refs) {
					try {
						const docSnapshot = await getDoc(ref)
						//@ts-ignore
						documents.push({
							//@ts-ignore
							...docSnapshot.data(),
							_ref: docSnapshot.ref,
							id: docSnapshot.id,
						} as InterestData)
					} catch (error) {
						console.error('Error getting document:', error)
					}
				}
			}
			setSelectedInterests(documents)
			setIsInterestsLoading(false)
		} catch (e) {
			console.log('FETCHING ERROR:', e)
			setIsInterestsLoading(false)
			showToast({
				message: 'Error, please try again',
				status: 'error',
			})
		}
	}

	const handleSubmit = async (e: React.FormEvent): Promise<any> => {
		try {
			e.preventDefault()
			setIsLoading(true)
			if (!(flat_share_profile && flat_share_profile._user_id)) {
				return showToast({
					message: 'Please refresh this page and sign in again',
					status: 'error',
				})
			}

			await FlatShareProfileService.update({
				data: {
					interests: selectedInterests.map((interest) => interest._ref),
				},
				document_id: flat_share_profile?._user_id,
			})

			setIsLoading(false)

			showToast({
				message: 'Your information has been updated',
				status: 'success',
			})

			return setTimeout(() => {
				window.location.href = '/settings'
			}, 1000)
		} catch (err: any) {
			setIsLoading(false)
			showToast({
				message: 'An error occurred while updating your information',
				status: 'error',
			})
		}
	}

	return (
		<Box maxW="600px" p="6" mx="auto">
			<Text fontSize={'2xl'} fontWeight={500} mb="6" textAlign={'center'}>
				Update your Interests
			</Text>
			<VStack spacing={4} align="stretch">
				<Wrap>
					{isInterestsLoading ? (
						<Box w={'full'} textAlign={'center'}>
							<Spinner />
						</Box>
					) : (
						<>
							{interestsList.map((interest) => (
								<WrapItem
									key={interest.id}
									justifyContent={'flex-start'}
									gap="0"
									p="2"
								>
									<EachOption
										label={interest.title}
										onClick={() => handleSelect(interest)}
										isActive={selectedInterests.some(
											(h) => h.id === interest.id,
										)}
									/>
								</WrapItem>
							))}

							<Button
								onClick={handleSubmit}
								isLoading={isLoading}
								type="submit"
								colorScheme="teal"
								size="lg"
								width="full"
								mt={4}
							>
								Update Interests
							</Button>
						</>
					)}
				</Wrap>
			</VStack>
		</Box>
	)
}

const EachOption = ({
	label,
	onClick,
	isActive,
}: {
	label: string
	onClick: () => void
	isActive?: boolean
}) => {
	return (
		<Flex
			as={'button'}
			onClick={onClick}
			color={isActive ? 'white' : 'dark_lighter'}
			bg={isActive ? 'brand_dark' : 'none'}
			fontSize={'sm'}
			border={'1px'}
			rounded={'full'}
			py={1}
			px={3}
		>
			{label}
		</Flex>
	)
}

export default InterestsForm
