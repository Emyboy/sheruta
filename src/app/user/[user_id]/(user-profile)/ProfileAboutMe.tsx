import { DEFAULT_PADDING } from '@/configs/theme'
import { Flex, Text } from '@chakra-ui/react'
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
            <Flex>

            </Flex>
		</Flex>
	)
}
