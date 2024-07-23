import { DEFAULT_PADDING } from '@/configs/theme'
import { Badge, Flex, Text } from '@chakra-ui/react'
import React from 'react'

type Props = {}

export default function ProfileAboutMe({}: Props) {
	return (
		<Flex flexDirection={'column'} gap={DEFAULT_PADDING}>
			<Text>
				Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates
				placeat possimus cumque ab suscipit. Sequi porro beatae doloribus,
				accusamus repudiandae unde laborum tenetur eius soluta eos deserunt qui
				tempore officiis.
			</Text>
			<Flex flexWrap={'wrap'} gap={2}>
				{new Array(10).fill(null).map((_) => {
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
							New f
						</Badge>
					)
				})}
			</Flex>
		</Flex>
	)
}
