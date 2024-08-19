import { DEFAULT_PADDING } from '@/configs/theme'
import { Badge, Flex, Text } from '@chakra-ui/react'
import React, { useState } from 'react';
import { FlatShareProfileData, flatShareProfileDefaults } from '@/firebase/service/flat-share-profile/flat-share-profile.types';

type Props = {
	data: any
}

export default function ProfileAboutMe({ data }: Props) {
	type Interest = {
		title: string
	}

	let userInterests: Interest[] = data.flatShareProfile?.interests;

	const userBio : string | null = data.flatshareProfile?.bio || null;

	console.log("User bio....................................",userBio);

	return (
		<Flex flexDirection={'column'} gap={DEFAULT_PADDING}>
			<Text>
				{userBio ? userBio : "Hi! I am a user of Sheruta. You should go through my profile and see if we are a match"}
			</Text>
			<Flex flexWrap={'wrap'} gap={2}>
			<Flex flexDirection={'column'} gap={DEFAULT_PADDING} >
			<Text color="brand">
				<Badge
					key={Math.random()}
					bg="border_color"
					px={3}
					rounded={'md'}
					_dark={{
						color: 'border_color',
						bg: 'dark_light',
					}}
				>Interests: </Badge>
			</Text>
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
