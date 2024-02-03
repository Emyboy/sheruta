'use client'
import { DEFAULT_PADDING } from '@/configs/theme'
import { Team, teams } from '@/data/team.data'
import { generateNumberFromRange } from '@/utils/index.utils'
import { Avatar, Button, Flex, Text, VStack } from '@chakra-ui/react'
import React from 'react'

type Props = {
	next: () => void
}

export default function WelcomeMessage({ next }: Props) {
	let theTeam: Team = teams[generateNumberFromRange(0, teams.length)]
	return (
		<VStack spacing={DEFAULT_PADDING} py={DEFAULT_PADDING}>
			<VStack spacing={0}>
				<Avatar src={theTeam?.avatar_url} bg="dark" size={'xl'} mb="5px" />
				<Text textAlign={'center'} fontWeight={'bold'}>
					{theTeam?.name}
				</Text>
				<Text textAlign={'center'} fontSize={'sm'}>
					{theTeam?.role}
				</Text>
			</VStack>
			<br />
			<Text textAlign={'center'}>
				{`
                Hello Sherutan! I am delighted to have you join our community.                          
            `}
				<br />
				{`I know how stressful house hunting can be from y personal experience, we hope Sheruta can help east he apartment search stress with little or no need of middle men. Whishing you the best in your apartment hunt.`}
				<br />
				May the odds forever be in your favour.
			</Text>
			<br />
			<Button w="full" bg="brand" colorScheme="" onClick={next}>
				Get Started
			</Button>
		</VStack>
	)
}
