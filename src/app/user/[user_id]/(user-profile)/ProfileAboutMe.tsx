import { DEFAULT_PADDING } from '@/configs/theme'
import { Badge, Flex, Text } from '@chakra-ui/react'
import React, { useState } from 'react'

type Props = {
	data: any
}

export default function ProfileAboutMe({ data }: Props) {
	type Interest = {
		title: string
	}

	let userInterests: Interest[] = data.flatShareProfile?.interests

	return (
		<Flex flexDirection={'column'} gap={DEFAULT_PADDING}>
			<Text>
				Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates
				placeat possimus cumque ab suscipit. Sequi porro beatae doloribus,
				accusamus repudiandae unde laborum tenetur eius soluta eos deserunt qui
				tempore officiis.
			</Text>
			<Flex flexWrap={'wrap'} gap={2}>
				{userInterests.map((item) => {
					return (
						<Badge
							key={Math.random()}
							bg="border_color"
							px={3}
							rounded={'md'}
							_dark={{
								color: 'border_color',
								bg: 'dark_light',
							}}
						>
							{item.title}
						</Badge>
					)
				})}
			</Flex>
		</Flex>
	)
}
