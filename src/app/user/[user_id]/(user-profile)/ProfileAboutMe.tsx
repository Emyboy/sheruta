import { DEFAULT_PADDING } from '@/configs/theme'
import { Badge, Flex, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import {
	FlatShareProfileData,
	flatShareProfileDefaults,
} from '@/firebase/service/flat-share-profile/flat-share-profile.types'

type Props = {
	userProfile: any
}

export default function ProfileAboutMe({ userProfile }: Props) {
	type Interest = {
		title: string
	}
	let userInterests: Interest[] = userProfile.flatShareProfile?.interests
	const userBio: string | null = userProfile.flatShareProfile?.bio || null
	return (
		<Flex flexDirection={'column'} gap={DEFAULT_PADDING}>
			<Text>
				{userBio
					? userBio
					: 'Hi! I am a user of Sheruta. You should go through my profile and see if we are a match'}
			</Text>
			<Flex flexWrap={'wrap'} gap={3}>
				<Flex flexDirection={'column'} gap={DEFAULT_PADDING}>
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
						<Text color="border_color">Interests</Text>
					</Badge>
				</Flex>
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
