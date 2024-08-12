import Confetti from 'react-confetti'
import React, { useEffect, useState } from 'react'
import { Flex, Text } from '@chakra-ui/react'

export default function GetStartedCompleted({ done }: { done: () => void; }){
	const [width, setWidth] = useState(100);
	const [height, setHeight] = useState(400)
	const [run, setRun] = useState(true);

	useEffect(() => {
		if(typeof window !== undefined) {
			setHeight(window.innerHeight);
			setWidth(window.innerWidth);
			setTimeout(() => {
				setRun(false)
				setTimeout(() => {
					window.location.reload()
				},2000)
			},4000)
		}
	},[])

	return <>
		<Flex
			mt={{
				base: '30rem',
				md: '10px',
			}}
			flexDir={'column'}
			justifyContent={'center'}
			alignItems={'center'}
		>
			<Text
				textAlign={'center'}
				as={'h1'}
				fontSize={'3xl'}
				className={'animate__animated animate__fadeInUp animate__faster'}
			>
				{`Congratulation 🎉`}
			</Text>
			<Text
				textAlign={'center'}
				color={'dark_lighter'}
				className={'animate__animated animate__fadeInUp'}
			>
				{`Welcome to the Sheruta community`}
			</Text>
			<Confetti
				width={width}
				height={height}
				numberOfPieces={run ? 200 : 0}
			/>
		</Flex>
	</>
}
