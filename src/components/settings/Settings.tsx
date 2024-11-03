'use client'
import { useAuthContext } from '@/context/auth.context'
import {
	Box,
	Flex,
	Heading,
	Text,
	Stack,
	Icon,
	Divider,
	useColorMode,
	useColorModeValue,
} from '@chakra-ui/react'
import Link from 'next/link'
import {
	BiBuildings,
	BiLike,
	BiSolidLock,
	BiSolidMap,
	BiSolidMoon,
	BiSolidSmile,
	BiSolidSun,
	BiSolidUserCircle,
} from 'react-icons/bi'
import { IconType } from 'react-icons/lib'

const SettingOption = ({
	icon,
	label,
	href,
	color,
}: {
	icon: IconType
	label: string
	href: string
	color: string
}) => {
	return (
		<Link href={href}>
			<Flex
				color={color}
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
	const { toggleColorMode, colorMode } = useColorMode()
	const {
		authState: { user_info },
	} = useAuthContext()

	const textColor = useColorModeValue('#000', 'dark_lighter')

	return (
		<Box maxW="600px" mx="auto">
			<Heading mb={10} color={'dark-light'}>
				Settings
			</Heading>
			<Stack spacing={4}>
				{/* {user_info && user_info._user_id ? (
					<>
						<Text color={'dark-light'} fontSize="lg" fontWeight="bold">
							Personal Information
						</Text>
						<SettingOption
							color={textColor}
							href="/settings/personal-info"
							icon={BiSolidUserCircle}
							label="Personal Info"
						/>
						<SettingOption
							color={textColor}
							href="/settings/flat-share-profile"
							icon={BiBuildings}
							label="Flat share profile"
						/>
						<SettingOption
							color={textColor}
							href="/settings/update-habits"
							icon={BiLike}
							label="Habits"
						/>

						<Divider />

						<Text fontSize="lg" fontWeight="bold">
							Preferences
						</Text>

						<SettingOption
							color={textColor}
							href="/settings/search-preferences"
							icon={BiSolidMap}
							label="Search Preferences"
						/>
						<SettingOption
							color={textColor}
							href="/settings/update-interests"
							icon={BiSolidSmile}
							label="Interests"
						/>

						<Divider />

						<Text fontSize="lg" fontWeight="bold">
							Privacy & Security
						</Text>
						<SettingOption
							color={textColor}
							href="/settings/privacy-settings"
							icon={BiSolidLock}
							label="Update Privacy Settings"
						/>
					</>
				) : null} */}
                   <>
						<Text color={'dark-light'} fontSize="lg" fontWeight="bold">
							Personal Information
						</Text>
						<SettingOption
							color={textColor}
							href="/settings/personal-info"
							icon={BiSolidUserCircle}
							label="Personal Info"
						/>
						<SettingOption
							color={textColor}
							href="/settings/flat-share-profile"
							icon={BiBuildings}
							label="Flat share profile"
						/>
							<SettingOption
							color={textColor}
							href="/settings/update-habits"
							icon={BiLike}
							label="Habits"
						/>
						</>
				<Text fontSize="lg" fontWeight="bold">
					Display mode
				</Text>
				<Flex
					onClick={toggleColorMode}
					color={textColor}
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
					<Icon
						as={colorMode === 'dark' ? BiSolidSun : BiSolidMoon}
						w={6}
						h={6}
						mr={4}
					/>
					<Text fontSize="lg">{`Toggle ${colorMode === 'dark' ? 'light' : 'dark'} mode`}</Text>
				</Flex>
			</Stack>
		</Box>
	)
}

export default Settings
