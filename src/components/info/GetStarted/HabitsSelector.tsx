'use client'
import { useAuthContext } from '@/context/auth.context'
import { useOptionsContext } from '@/context/options.context'
import { HabitData } from '@/firebase/service/options/options.types'
import useAuthenticatedAxios from '@/hooks/useAxios'
import { Button, Flex, Text } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

export default function HabitsSelector({ done }: { done?: () => void }) {
	const {
		authState: { user, flat_share_profile },
		setAuthState,
	} = useAuthContext()

	const axiosInstance = useAuthenticatedAxios()

	const {
		optionsState: { habits },
	} = useOptionsContext()

	const [loading, setLoading] = useState(false)
	const [selectedHabits, setSelectedHabits] = useState<string[]>(
		flat_share_profile?.habits || [],
	)

	const selectHabit = (habitId: string) =>
		setSelectedHabits((prevHabits) => {
			if (prevHabits.includes(habitId)) {
				return prevHabits.filter(
					(existingHabitId) => existingHabitId !== habitId,
				)
			} else {
				return [...selectedHabits, habitId]
			}
		})

	const { mutate } = useMutation({
		mutationFn: async () => {
			if (!axiosInstance) return null

			if (user) {
				setLoading(true)

				await axiosInstance.put('/flat-share-profile', {
					habits: selectedHabits,
				})
			}
		},
		onSuccess: () => {
			setAuthState({
				// @ts-ignore
				flat_share_profile: { ...flat_share_profile, habits: selectedHabits },
			})

			setLoading(false)
			if (done) {
				done()
			}
		},
		onError: (err) => {
			setLoading(false)
			console.error(err)
		},
	})

	return (
		<Flex flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
			<Text
				textAlign={'center'}
				as={'h1'}
				fontSize={'3xl'}
				className={'animate__animated animate__fadeInUp animate__faster'}
			>
				{`What are your habits?`}
			</Text>
			<Text
				textAlign={'center'}
				color={'dark_lighter'}
				className={'animate__animated animate__fadeInUp'}
			>
				{`Select habits unique to you alone`}
			</Text>
			{/* {fetching && (
				<>
					<br />
					<DotsLoading />
					<br />
				</>
			)} */}
			<Flex
				flexWrap={'wrap'}
				gap={3}
				py={10}
				className={'animate__animated animate__fadeIn'}
			>
				{habits.map((habit) => {
					return (
						<EachOption
							isActive={selectedHabits.includes(habit._id)}
							label={habit.name}
							onClick={() => selectHabit(habit._id)}
							key={habit.slug}
						/>
					)
				})}
			</Flex>
			<br />

			<Button
				onClick={() => mutate()}
				isDisabled={!selectedHabits.length}
				isLoading={loading}
			>{`Next`}</Button>
		</Flex>
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
