'use client'
import { Button, Flex, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import useCommon from '@/hooks/useCommon'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import { HabitData } from '@/firebase/service/options/options.types'
import FlatShareProfileService from '@/firebase/service/flat-share-profile/flat-share-profile.firebase'
import { useAuthContext } from '@/context/auth.context'
import DotsLoading from '@/components/info/GetStarted/DotsLoading'
import { getDoc } from 'firebase/firestore'

export default function InterestsSelector({ done }: { done?: () => void }) {
	const {
		authState: { user, flat_share_profile },
		getAuthDependencies,
	} = useAuthContext()
	const { showToast } = useCommon()
	const [habits, setHabits] = useState<HabitData[]>([])
	const [loading, setLoading] = useState(false)
	const [fetching, setFetching] = useState(false)
	const [selectedHabits, setSelectedHabits] = useState<HabitData[]>([])

	const getAllHabits = async () => {
		try {
			setFetching(true)
			let res = await SherutaDB.getAll({
				collection_name: DBCollectionName.interests,
				_limit: 50,
			})

			const documents:HabitData[] = [];
			let refs = flat_share_profile?.interests as any[]

			if(refs && refs?.length > 0){
				for (const ref of refs) {
					try {
						const docSnapshot = await getDoc(ref);
						//@ts-ignore
						documents.push({...docSnapshot.data(), ref: docSnapshot.ref, id: docSnapshot.id} as HabitData);
					} catch (error) {
						console.error('Error getting document:', error);
					}
				}
			}

			setSelectedHabits(documents)
			setHabits(res)
			setFetching(false)
		} catch (e) {
			setFetching(false)
			showToast({
				message: 'Error, please try again',
				status: 'error',
			})
		}
	}

	const selectHabit = (habit:HabitData) => {
		let habitExist = selectedHabits.find(x => x.id == habit.id);
		if(habitExist) {
			setSelectedHabits(selectedHabits.filter(x => x.id !== habit.id))
		}else {
			setSelectedHabits([...selectedHabits, habit])
		}
	}

	const update = async () => {
		if (user) {
			setLoading(true)
			await FlatShareProfileService.update({
				data: { interests: selectedHabits.map(val => val.ref) },
				document_id: user?._id,
			})
			await getAuthDependencies()
			setLoading(false)
			if (done) {
				done()
			}
		}
	}

	useEffect(() => {
		getAllHabits()
	}, []);


	return (
		<Flex flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
			<Text textAlign={'center'} as={'h1'} fontSize={'3xl'} className={'animate__animated animate__fadeInUp animate__faster'}>
				{`Pick what interests you?`}
			</Text>
			<Text textAlign={'center'} color={'dark_lighter'} className={'animate__animated animate__fadeInUp'}>
				{`Help our matching algorithm find the best match`}
			</Text>
			{fetching && <>
				<br />
				<DotsLoading />
				<br />
			</>
			}
			<Flex flexWrap={'wrap'} gap={3} py={10} className={'animate__animated animate__fadeIn'}>
				{habits.map((habit) => {
					return (
						<EachOption
							isActive={selectedHabits.filter(x => x.id == habit.id).length > 0}
							label={habit.title}
							onClick={() => selectHabit(habit)}
							key={habit.slug}
						/>
					)
				})}
			</Flex>
			<br />
			{!fetching && <Button onClick={update} isLoading={loading}>{`Next`}</Button>}
		</Flex>
	)
}

const EachOption = ({
											label,
											onClick,
											isActive
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
