import { DEFAULT_PADDING } from '@/configs/theme'
import { Box, Button, Center, Flex, Spinner, Text } from '@chakra-ui/react'
import React from 'react'
import { BiLogoFacebookCircle, BiLogoGoogle } from 'react-icons/bi'
import MainModal from '../atoms/MainModal'
import { useAuthContext } from '@/context/auth.context'
import { useAppContext } from '@/context/app.context'

interface Props {}

export default function AuthPopup(props: Props) {
	const { loginWithGoogle } = useAuthContext()
	const { authState } = useAuthContext()
	const { user, auth_loading } = authState
	const { appState, setAppState } = useAppContext()
	const { show_login } = appState

	if (user) {
		return null
	}

	return (
		<MainModal
			isOpen={show_login}
			onClose={() => setAppState({ show_login: false })}
		>
			<Center mb={DEFAULT_PADDING}>
				<Text fontSize={'x-large'} fontWeight={'bold'}>
					Login / Signup
				</Text>
			</Center>
			{auth_loading ? (
				<Flex minH={'200px'} justifyContent={'center'} alignItems={'center'}>
					<Spinner size="lg" />
				</Flex>
			) : (
				<>
					<Flex flexDirection={'column'} gap={DEFAULT_PADDING}>
						<EachSocial
							label="Login with Google"
							Icon={BiLogoGoogle}
							onClick={loginWithGoogle}
						/>
						<EachSocial
							label="Login with Facebook"
							Icon={BiLogoFacebookCircle}
							onClick={() => {}}
						/>
					</Flex>
					<Button
						variant={'ghost'}
						padding={DEFAULT_PADDING}
						_dark={{
							borderColor: 'dark_light',
						}}
						rounded={'md'}
						alignItems={'center'}
						gap={DEFAULT_PADDING}
						justifyContent={'center'}
						cursor={'pointer'}
						py={7}
						// _hover={{
						//     bg: 'none'
						// }}
						onClick={() => setAppState({ show_login: false })}
					>
						Cancel
					</Button>
				</>
			)}
		</MainModal>
	)
}

const EachSocial = ({
	Icon,
	label,
	onClick,
}: {
	Icon: any
	label: string
	onClick: () => void
}) => {
	return (
		<Flex
			onClick={onClick}
			padding={DEFAULT_PADDING}
			border={'1px'}
			borderColor={'border_color'}
			_dark={{
				borderColor: 'dark_light',
			}}
			rounded={'md'}
			alignItems={'center'}
			gap={DEFAULT_PADDING}
			justifyContent={'center'}
			cursor={'pointer'}
			_hover={{
				bg: 'dark',
				color: 'white',
				_dark: {
					bg: 'dark_light',
				},
			}}
		>
			<Box>
				<Icon size={25} />
			</Box>
			<Flex>
				<Text>{label}</Text>
			</Flex>
		</Flex>
	)
}
