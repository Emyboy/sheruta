import { DEFAULT_PADDING } from '@/configs/theme'
import {
	Box,
	Button,
	Center,
	Flex,
	ModalProps,
	Text,
	useToast,
} from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { BiLogoFacebookCircle, BiLogoGooglePlus } from 'react-icons/bi'
import MainModal from '../atoms/MainModal'
import {
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
} from 'firebase/auth'
import { auth } from '@/firebase'

interface Props extends Partial<ModalProps> {
	isOpen: boolean
	onClose: () => void
	children?: any
}

export default function AuthPopup(props: Props) {
	const { isOpen, onClose } = props
	const toast = useToast()

	const loginWithGoogle = async () => {
		const provider = new GoogleAuthProvider()
		signInWithPopup(auth, provider)
			.then((result) => {
				const credential = GoogleAuthProvider.credentialFromResult(result)
				const token = credential?.accessToken
				const user = result.user
				console.log({
					user,
					token,
					credential,
				})
			})
			.catch((error) => {
				toast({ title: 'Error, please try again', status: 'error' })
				// console.log(error)
				// const errorCode = error.code
				// const errorMessage = error.message
				// const email = error.customData.email
				// const credential = GoogleAuthProvider.credentialFromError(error)
			})
	}

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				console.log('USER FOUND::', user)
			} else {
			}
		})
	}, [])

	return (
		<MainModal isOpen={isOpen} onClose={onClose}>
			<Center mb={DEFAULT_PADDING}>
				<Text fontSize={'x-large'} fontWeight={'bold'}>
					Login / Signup
				</Text>
			</Center>
			<Flex flexDirection={'column'} gap={DEFAULT_PADDING}>
				<EachSocial
					label="Login with Google"
					Icon={BiLogoGooglePlus}
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
				onClick={onClose}
			>
				Cancel
			</Button>
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
