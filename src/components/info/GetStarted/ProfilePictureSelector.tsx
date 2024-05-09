import { Button, Flex, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BiCamera, BiPencil } from 'react-icons/bi'

export default function ProfilePictureSelector({
	done,
}: {
	done?: () => void
}) {
	const [loading, setLoading] = useState(false)

	const update = () => {}

	return (
		<Flex flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
			<Text
				textAlign={'center'}
				as={'h1'}
				fontSize={'3xl'}
				className={'animate__animated animate__fadeInUp animate__faster'}
			>
				{`Profile picture`}
			</Text>
			<Text
				textAlign={'center'}
				color={'dark_lighter'}
				className={'animate__animated animate__fadeInUp'}
			>
				{`It's nice to put a face to the name`}
			</Text>
			<br />

			<Flex justifyContent={'center'}>
				<Flex
					bg={'brand'}
					h={'170px'}
					w={'170px'}
					rounded={'full'}
					my={10}
					p={1}
					alignItems={'center'}
					justifyContent={'center'}
				>
					<Flex
						bg={'black'}
						h={'full'}
						w={'full'}
						border={'1px'}
						rounded={'full'}
						my={10}
						alignItems={'center'}
						justifyContent={'center'}
						color={'text_muted'}
					>
						<BiCamera size={50} />
					</Flex>
				</Flex>
			</Flex>

			<br />
			<Button onClick={update} isLoading={loading}>{`Next`}</Button>
		</Flex>
	)
}
