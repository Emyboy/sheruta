'use client'
import { Flex, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import useCommon from '@/hooks/useCommon'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import { HabitData } from '@/firebase/service/options/options.types'


export default function HabitsSelector({ done }: { done?: () => void }) {
	const { showToast } = useCommon();
	const [habits, setHabits] = useState<HabitData[]>([]);
	const [loading, setLoading] = useState(false);
	const [selectedHabits, setSelectedHabits] = useState([])

	const getAllHabits = async () => {
console.log('GETTING HABITS')
		try {
		setLoading(true);
			let res = await SherutaDB.getAll({
				collection_name: DBCollectionName.habits,
				_limit: 50
			})
			console.log('HABITS::', res)
		setLoading(false);
			setHabits(res)
		}catch (e) {
		setLoading(false);
			showToast({
				message: "Error, please try again",
				status: "error",
			})
		}
	}

	const selectHabit = () => {

	}

	useEffect(() => {
		getAllHabits()
	},[])

	return <Flex flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
		<Text textAlign={'center'} as={'h1'} fontSize={'3xl'}>
			{`What are your habits?`}
		</Text>
		<Text textAlign={'center'} color={'dark_lighter'}>
			{`Help our matching algorithm find the best match`}
		</Text>
		<Flex flexWrap={'wrap'} gap={3} py={10}>
			{
				habits.map(habit => {
					return <EachOption label={habit.title} onClick={selectHabit} key={habit.slug} />
				})
			}
		</Flex>
	</Flex>
}

const EachOption = ({ label, onClick }:{ label:string, onClick: () => void;}) => {
	return <Flex as={'button'} onClick={onClick} color={'text_muted'} fontSize={'sm'} border={'1px'} rounded={'full'} py={1} px={3}>
		{label}
	</Flex>
}
