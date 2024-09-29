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
	InputGroup,
	InputRightElement,
	Alert,
	AlertIcon,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { BiLogoGoogle } from 'react-icons/bi'
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs'
import MainModal from '../atoms/MainModal'
import { useAuthContext } from '@/context/auth.context'
import { useAppContext } from '@/context/app.context'
import {
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	sendEmailVerification,
} from 'firebase/auth'
import { auth } from '@/firebase'
import AuthService from '@/firebase/service/auth/auth.firebase'
import useCommon from '@/hooks/useCommon'
import { DocumentData } from 'firebase/firestore'

interface Props {}

export default function AuthPopup(props: Props) {
	const {
		authState: { user, auth_loading },
	} = useAuthContext()
	const { appState, setAppState } = useAppContext()
	const { show_login } = appState

	const [isSignUp, setIsSignUp] = useState<boolean>(true)
	const [isPasswordReset, setIsPasswordReset] = useState<boolean>(false)

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
			) : isPasswordReset ? (
				<PasswordResetForm
					setIsPasswordReset={setIsPasswordReset}
					setIsSignUp={setIsSignUp}
				/>
			) : (
				<AuthForm
					isSignUp={isSignUp}
					setIsSignUp={setIsSignUp}
					setIsPasswordReset={setIsPasswordReset}
				/>
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

const PasswordResetForm = ({
	setIsPasswordReset,
	setIsSignUp,
}: {
	setIsPasswordReset: (arg: boolean) => void
	setIsSignUp: (arg: boolean) => void
}) => {
	const [email, setEmail] = useState('')
	// const [message, setMessage] = useState('')
	// const [error, setError] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	const { showToast } = useCommon()

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value)
	}

	const handlePasswordReset = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		try {
			await sendPasswordResetEmail(auth, email)
			showToast({
				message: 'Password reset email sent successfully!',
				status: 'success',
			})
			setIsPasswordReset(false)
		} catch (err) {
			showToast({
				message: `An error occurred while sending password reset email. Please try again later.`,
				status: 'error',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<form onSubmit={handlePasswordReset}>
			<Center mb={DEFAULT_PADDING}>
				<Text fontSize={'x-large'} fontWeight={'bold'}>
					Reset your password
				</Text>
			</Center>
			<Alert mb={5} status="info" variant="subtle">
				<AlertIcon />
				Enter the email address linked to your account and click on the reset
				password button
			</Alert>
			<VStack spacing={4} width="100%">
				<FormControl>
					<FormLabel>Email</FormLabel>
					<Input
						type="email"
						value={email}
						onChange={handleEmailChange}
						placeholder="Enter your email"
						isRequired
					/>
				</FormControl>

				<Button
					type="submit"
					bgColor={'brand'}
					width="full"
					isLoading={isSubmitting}
				>
					Reset Password
				</Button>

				<Box width={'full'} textAlign={'center'}>
					<Text
						cursor={'pointer'}
						textDecoration="underline"
						onClick={() => {
							setIsSignUp(false), setIsPasswordReset(false)
						}}
					>
						Have you remembered your password?
					</Text>
				</Box>
			</VStack>
		</form>
	)
}

const AuthForm: React.FC<{
	isSignUp: boolean
	setIsSignUp: (arg: boolean) => void
	setIsPasswordReset: (arg: boolean) => void
}> = ({ isSignUp, setIsSignUp, setIsPasswordReset }) => {
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

	const { loginWithGoogle } = useAuthContext()

	const [errors, setErrors] = useState({
		email: '',
		password: '',
		firstName: '',
		lastName: '',
	})

	const { setAuthState } = useAuthContext()

	const { showToast } = useCommon()

	const [loading, setIsLoading] = useState<boolean>(false)
	const [showPassword, setShowPassword] = useState(false)

	const handlePasswordVisibility = () => setShowPassword(!showPassword)

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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const handleSignUp = async (data: {
		email: string
		password: string
		firstName: string
		lastName: string
	}): Promise<DocumentData | undefined> => {
		try {
			setIsLoading(true)

			const { email, password, firstName, lastName } = data

			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password,
			)

			const user = userCredential.user

			const theUser = await AuthService.loginUser({
				displayName: `${firstName} ${lastName}`,
				email: user.email as string,
				providerId: 'email',
				uid: user.uid as string,
				phoneNumber: user.phoneNumber,
				photoURL: user.photoURL,
			})

			return theUser
		} catch (err: any) {
			throw Error(err)
		} finally {
			setIsLoading(false)
		}
	}

	const handleLogin = async (data: {
		email: string
		password: string
	}): Promise<DocumentData | undefined> => {
		try {
			setIsLoading(true)

			const { email, password } = data

			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password,
			)

			const user = userCredential.user

			const theUser = await AuthService.loginUser({
				displayName: user?.displayName || '',
				email: user.email as string,
				providerId: 'email',
				uid: user.uid as string,
				phoneNumber: user.phoneNumber,
				photoURL: user.photoURL,
			})

			return theUser
		} catch (err: any) {
			throw Error(err)
		} finally {
			setIsLoading(false)
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		try {
			setIsLoading(true)

			e.preventDefault()

			if (!validateForm()) {
				console.log(errors)
				return
			}

			if (isSignUp) {
				const theUser = await handleSignUp(formData)

				setAuthState({ ...(theUser as any), auth_loading: false })

				return showToast({
					message: `Account created successfully!`,
					status: 'success',
				})
			} else {
				const theUser = await handleLogin({
					email: formData.email,
					password: formData.password,
				})

				setAuthState({ ...(theUser as any), auth_loading: false })

				return showToast({
					message: 'You have logged in successfully!',
					status: 'success',
				})
			}
		} catch (err: any) {
			console.log(err)
			if (err.message.includes('invalid-credential')) {
				showToast({
					message: 'Invalid email or password.',
					status: 'error',
				})
			} else if (err.message.includes('email-already-in-use')) {
				showToast({
					message: 'Email already exists. Please try signing in.',
					status: 'error',
				})
			} else if (err.message.includes('too-many-requests')) {
				showToast({
					message: `Too many failed login attempts. Please reset your password and try again.`,
					status: 'error',
				})
			} else {
				showToast({
					message: `An error occurred while ${isSignUp ? 'signing up' : 'signing in'}. Please try again later.`,
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
										onChange={handleChange}
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
										onChange={handleChange}
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
								onChange={handleChange}
								placeholder="Enter your email"
							/>
							{errors.email && (
								<FormErrorMessage>{errors.email}</FormErrorMessage>
							)}
						</FormControl>
						<FormControl isInvalid={!!errors.password}>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									name="password"
									type={showPassword ? 'text' : 'password'}
									value={formData.password}
									onChange={handleChange}
									placeholder="Enter your password"
								/>
								<InputRightElement width="">
									<Button onClick={handlePasswordVisibility}>
										{showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
									</Button>
								</InputRightElement>
							</InputGroup>
							{errors.password && (
								<FormErrorMessage>{errors.password}</FormErrorMessage>
							)}
						</FormControl>

						<Button
							isLoading={loading}
							disabled={loading}
							type="submit"
							bgColor="brand"
							mt={4}
							width="full"
						>
							{isSignUp ? 'Sign Up' : 'Login'}
						</Button>

						{!isSignUp ? (
							<Box mt={2} width={'full'} textAlign={'center'}>
								<Text
									cursor={'pointer'}
									textDecoration="underline"
									onClick={() => setIsPasswordReset(true)}
								>
									Forgot password?
								</Text>
							</Box>
						) : null}

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
