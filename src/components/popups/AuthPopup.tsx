import { DEFAULT_PADDING } from '@/configs/theme'
import {
	Box,
	Button,
	Center,
	Flex,
	Spinner,
	Text,
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	VStack,
	HStack,
	IconButton,
	useColorMode,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import {
	BiLogoFacebook,
	BiLogoFacebookCircle,
	BiLogoGoogle,
} from 'react-icons/bi'
import MainModal from '../atoms/MainModal'
import { useAuthContext } from '@/context/auth.context'
import { useAppContext } from '@/context/app.context'
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from 'firebase/auth'
import { auth } from '@/firebase'
import AuthService from '@/firebase/service/auth/auth.firebase'
import useCommon from '@/hooks/useCommon'

interface Props {}

export default function AuthPopup(props: Props) {
	const { authState } = useAuthContext()
	const { user, auth_loading } = authState
	const { appState, setAppState } = useAppContext()
	const { show_login } = appState

	const [isSignUp, setIsSignUp] = useState<boolean>(true)

	if (user) {
		return null
	}

	return (
		<MainModal
			isOpen={show_login}
			onClose={() => setAppState({ show_login: false })}
		>
			{auth_loading ? (
				<Flex minH={'200px'} justifyContent={'center'} alignItems={'center'}>
					<Spinner size="lg" />
				</Flex>
			) : (
				<AuthForm isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
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

const AuthForm: React.FC<{
	isSignUp: boolean
	setIsSignUp: (arg: boolean) => void
}> = ({ isSignUp, setIsSignUp }) => {
	const [formData, setFormData] = useState<{
		firstName: string
		lastName: string
		email: string
		password: string
	}>({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
	})

	const { colorMode } = useColorMode()
	const { loginWithGoogle } = useAuthContext()

	const [errors, setErrors] = useState({
		email: '',
		password: '',
		firstName: '',
		lastName: '',
	})

	const { showToast } = useCommon()

	const [loading, setIsLoading] = useState<boolean>(false)

	const validateForm = () => {
		let isValid = true
		let emailError = ''
		let passwordError = ''
		let firstNameError = ''
		let lastNameError = ''

		if (!formData.email) {
			emailError = 'Email is required'
			isValid = false
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			emailError = 'Email is invalid'
			isValid = false
		}

		if (!formData.password) {
			passwordError = 'Password is required'
			isValid = false
		} else if (formData.password.length < 6) {
			passwordError = 'Password must be at least 6 characters'
			isValid = false
		}

		if (isSignUp) {
			if (!formData.firstName) {
				firstNameError = 'First name is required'
				isValid = false
			}

			if (!formData.lastName) {
				lastNameError = 'Last name is required'
				isValid = false
			}
		}

		setErrors({
			email: emailError,
			password: passwordError,
			firstName: firstNameError,
			lastName: lastNameError,
		})

		return isValid
	}

	const handleChage = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		try {
			setIsLoading(true)

			e.preventDefault()

			if (!validateForm()) {
				console.log(errors)
				return
			}

			const { email, password, firstName, lastName } = formData

			if (isSignUp) {
				const userCredential = await createUserWithEmailAndPassword(
					auth,
					email,
					password,
				)

				const user = userCredential.user

				await AuthService.loginUser({
					displayName: `${firstName} ${lastName}`,
					email: user.email as string,
					providerId: 'email',
					uid: user.uid as string,
					phoneNumber: user.phoneNumber,
					photoURL: user.photoURL,
				})
			} else {
				await signInWithEmailAndPassword(auth, email, password)
			}

			return showToast({
				message: `${isSignUp ? 'Account created successfully!' : 'You have logged in successfully!'}`,
				status: 'success',
			})
		} catch (err: any) {
			console.log(err)
			if (err.message.includes('email-already-in-use')) {
				showToast({
					message: 'Email already exists. Please try signing in.',
					status: 'error',
				})
			} else {
				showToast({
					message: `An error occurred while ${isSignUp ? 'signing up' : 'logging in'}. Please try again later.`,
					status: 'error',
				})
			}
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Box width="100%">
			<VStack spacing={6} width="100%">
				<Center mb={DEFAULT_PADDING}>
					<Text fontSize={'x-large'} fontWeight={'bold'}>
						{isSignUp ? 'Sign Up' : 'Login'}
					</Text>
				</Center>
				<form onSubmit={handleSubmit}>
					<VStack spacing={2} width={'100%'}>
						{isSignUp ? (
							<>
								<FormControl width="100%" isInvalid={!!errors.firstName}>
									<FormLabel>First Name</FormLabel>
									<Input
										name="firstName"
										size={'lg'}
										type="text"
										value={formData.firstName}
										onChange={handleChage}
										placeholder="Enter your first name"
									/>
									{errors.firstName && (
										<FormErrorMessage>{errors.firstName}</FormErrorMessage>
									)}
								</FormControl>

								<FormControl width="100%" isInvalid={!!errors.lastName}>
									<FormLabel>Last Name</FormLabel>
									<Input
										name="lastName"
										size={'lg'}
										type="text"
										value={formData.lastName}
										onChange={handleChage}
										placeholder="Enter your last name"
									/>
									{errors.lastName && (
										<FormErrorMessage>{errors.lastName}</FormErrorMessage>
									)}
								</FormControl>
							</>
						) : null}

						<FormControl width="100%" isInvalid={!!errors.email}>
							<FormLabel>Email</FormLabel>
							<Input
								name="email"
								size={'lg'}
								type="email"
								value={formData.email}
								onChange={handleChage}
								placeholder="Enter your email"
							/>
							{errors.email && (
								<FormErrorMessage>{errors.email}</FormErrorMessage>
							)}
						</FormControl>

						<FormControl isInvalid={!!errors.password}>
							<FormLabel>Password</FormLabel>
							<Input
								name="password"
								type="password"
								value={formData.password}
								onChange={handleChage}
								placeholder="Enter your password"
							/>
							{errors.password && (
								<FormErrorMessage>{errors.password}</FormErrorMessage>
							)}
						</FormControl>

						<Button
							isLoading={loading}
							disabled={loading}
							type="submit"
							colorScheme="teal"
							mt={4}
							width="full"
						>
							{isSignUp ? 'Sign Up' : 'Login'}
						</Button>

						<Box color="gray.500" mt={2}>
							{isSignUp ? (
								<Text
									cursor={'pointer'}
									textDecoration="underline"
									onClick={() => setIsSignUp(false)}
								>
									Already have an account?
								</Text>
							) : (
								<Text
									cursor={'pointer'}
									textDecoration="underline"
									onClick={() => setIsSignUp(true)}
								>
									Don&apos;t have an account?
								</Text>
							)}
						</Box>
					</VStack>
				</form>
			</VStack>

			<HStack justifyContent={'center'} mt={4} spacing={4}>
				<EachSocial
					Icon={BiLogoGoogle}
					label="Sign in with Google"
					onClick={loginWithGoogle}
				/>
				{/* <IconButton
					width="full"
					borderColor={'border_color'}
					_dark={{
						borderColor: 'dark_light',
					}}
					onClick={loginWithGoogle}
					colorScheme={colorMode === 'dark' ? '' : 'gray'}
					fontSize={'24px'}
					aria-label="Options"
					icon={<BiLogoGoogle />}
					_hover={{
						bg: 'dark',
						color: 'white',
						_dark: {
							bg: 'dark_light',
						},
					}}
				/> */}

				{/* <IconButton
					colorScheme={colorMode === 'dark' ? '' : 'gray'}
					fontSize={'24px'}
					aria-label="Options"
					icon={<BiLogoFacebook />}
					_hover={{
						bg: 'dark',
						color: 'white',
						_dark: {
							bg: 'dark_light',
						},
					}}
				/> */}
			</HStack>
		</Box>
	)
}
