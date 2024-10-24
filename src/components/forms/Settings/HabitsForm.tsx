'use client'

import Spinner from '@/components/atoms/Spinner'
import { useAuthContext } from '@/context/auth.context'
import { OptionType, useOptionsContext } from '@/context/options.context'
import FlatShareProfileService from '@/firebase/service/flat-share-profile/flat-share-profile.firebase'
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

const HabitsForm = () => {
	const [isHabitsLoading, setIsHabitsLoading] = useState<boolean>(true)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const { showToast } = useCommon()

	const {
		optionsState: { habits },
	} = useOptionsContext()
	const {
		authState: { flat_share_profile },
	} = useAuthContext()

	const [habitsList, setHabitsList] = useState<OptionType[]>([])
	const [selectedHabits, setSelectedHabits] = useState<OptionType[]>([])

	const handleSelect = (habit: OptionType) => {
		setSelectedHabits((prev: OptionType[]) =>
			prev.some((h) => h._id === habit._id)
				? prev.filter((h) => h._id !== habit._id)
				: [...prev, habit],
		)
	}

	useEffect(() => {
		if (habits && flat_share_profile && flat_share_profile._user_id) {
			getAllHabits()
			setHabitsList(habits)
			return
		}
	}, [flat_share_profile, habits])

	const getAllHabits = async () => {
		try {
			setIsHabitsLoading(true)
			const documents: OptionType[] = []
			let refs = flat_share_profile?.habits as any[]

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
						} as OptionType)
					} catch (error) {
						console.error('Error getting document:', error)
					}
				}
			}
			setSelectedHabits(documents)
			setIsHabitsLoading(false)
		} catch (e) {
			console.log('FETCHING ERROR:', e)
			setIsHabitsLoading(false)
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

			// await FlatShareProfileService.update({
			// 	data: {
			// 		habits: selectedHabits.map((habit) => habit._ref),
			// 	},
			// 	document_id: flat_share_profile?._user_id,
			// })

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
				Update your Habits
			</Text>
			<VStack spacing={4} align="stretch">
				<Wrap>
					{isHabitsLoading ? (
						<Box w={'full'} textAlign={'center'}>
							<Spinner />
						</Box>
					) : (
						<>
							{habitsList.map((habit) => (
								<WrapItem
									key={habit._id}
									justifyContent={'flex-start'}
									gap="0"
									p="2"
								>
									<EachOption
										label={habit.name}
										onClick={() => handleSelect(habit)}
										isActive={selectedHabits.some((h) => h._id === habit._id)}
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
								Update Habits
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

export default HabitsForm
