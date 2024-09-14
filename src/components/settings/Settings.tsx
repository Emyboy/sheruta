'use client'
import {
	Box,
	Flex,
	Heading,
	Text,
	Stack,
	Icon,
	Divider,
} from '@chakra-ui/react'
import Link from 'next/link'
import {
	BiBuildings,
	BiLike,
	BiSolidLock,
	BiSolidMap,
	BiSolidSmile,
	BiSolidUserCircle,
} from 'react-icons/bi'
import { IconType } from 'react-icons/lib'

const SettingOption = ({
	icon,
	label,
	href,
}: {
	icon: IconType
	label: string
	href: string
}) => {
	return (
		<Link href={href}>
			<Flex
				color="dark_lighter"
				align="center"
				p={4}
				borderRadius="md"
				_hover={{
					bg: 'dark',
					color: 'white',
					_dark: {
						bg: 'dark_light',
						color: 'white',
					},
				}}
			>
				<Icon as={icon} w={6} h={6} mr={4} />
				<Text fontSize="lg">{label}</Text>
			</Flex>
		</Link>
	)
}

const Settings = () => {
	return (
		<Box maxW="600px" mx="auto">
			<Heading mb={10} color={'dark-light'}>
				Settings
			</Heading>

			<Stack spacing={4}>
				<Text color={'dark-light'} fontSize="lg" fontWeight="bold">
					Personal Information
				</Text>
				<SettingOption
					href="/settings/personal-info"
					icon={BiSolidUserCircle}
					label="Personal Info"
				/>
				<SettingOption
					href="/settings/flat-share-profile"
					icon={BiBuildings}
					label="Flat share profile"
				/>
				<SettingOption
					href="/settings/update-habits"
					icon={BiLike}
					label="Habits"
				/>

				<Divider />

				<Text fontSize="lg" fontWeight="bold">
					Preferences
				</Text>

				<SettingOption
					href="/settings/search-preferences"
					icon={BiSolidMap}
					label="Search Preferences"
				/>
				<SettingOption
					href="/settings/update-interests"
					icon={BiSolidSmile}
					label="Interests"
				/>

				<Divider />

				<Text fontSize="lg" fontWeight="bold">
					Privacy & Security
				</Text>
				<SettingOption
					href="/settings/privacy-settings"
					icon={BiSolidLock}
					label="Update Privacy Settings"
				/>
			</Stack>
		</Box>
	)
}

export default Settings
