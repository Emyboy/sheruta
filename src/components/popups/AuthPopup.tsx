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
	useToast,
	PinInput,
	PinInputField,
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
import { useMutation } from '@tanstack/react-query'

import { AxiosError } from 'axios'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { unAuthenticatedAxios } from '@/utils/custom-axios'

interface Props {}

const PUBLIC_URL = process.env.NEXT_PUBLIC_URL

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

const OTPDialog: React.FC<{
	email: string
	onVerificationSuccess: () => void
	password: string
}> = ({ email, onVerificationSuccess }) => {
	const [otp, setOTP] = useState('')
	const toast = useToast()
	const { setAppState } = useAppContext()

	const { mutate: verifyOTP, isPending } = useMutation({
		mutationFn: (data: { token: string }) =>
			unAuthenticatedAxios.post(`/auth/verify`, data),
		onError: (error: any) => {
			const errorMessage =
				error.response?.data?.message ||
				error?.message ||
				'OTP verification failed'
			toast({
				title: 'Error',
				description: errorMessage,
				status: 'error',
				duration: 3000,
				isClosable: true,
			})
		},
		onSuccess: () => {
			toast({
				title: 'Success',
				description: 'OTP verified successfully!',
				status: 'success',
				duration: 3000,
				isClosable: true,
			})
			signIn('credentials', {
				email,
				password: email,
			})
			setAppState({ show_login: false })
		},
	})

	const handleVerify = () => {
		if (otp.length === 6) {
			verifyOTP({ token: otp })
		} else {
			toast({
				title: 'Error',
				description: 'Please enter a valid 6-digit OTP',
				status: 'error',
				duration: 3000,
				isClosable: true,
			})
		}
	}

	return (
		<Box width="100%">
			<VStack spacing={6} width="100%">
				<Center mb={6}>
					<Text fontSize={'x-large'} fontWeight={'bold'}>
						Verify OTP
					</Text>
				</Center>
				<Text>
					An OTP has been sent to your email: {email}. Please enter it below.
				</Text>
				<FormControl>
					<FormLabel>Enter OTP</FormLabel>
					<HStack justifyContent="center">
						<PinInput otp value={otp} onChange={setOTP}>
							<PinInputField />
							<PinInputField />
							<PinInputField />
							<PinInputField />
							<PinInputField />
							<PinInputField />
						</PinInput>
					</HStack>
				</FormControl>
				<Button
					onClick={handleVerify}
					isLoading={isPending}
					bgColor="brand"
					width="full"
				>
					Verify OTP
				</Button>
			</VStack>
		</Box>
	)
}

interface SignUpProps {
	first_name: string
	last_name: string
	email: string
	password: string
}
const AuthForm: React.FC<{
	isSignUp: boolean
	setIsSignUp: (arg: boolean) => void
	setIsPasswordReset: (arg: boolean) => void
}> = ({ isSignUp, setIsSignUp, setIsPasswordReset }) => {
	const toast = useToast()
	const [showPassword, setShowPassword] = React.useState(false)
	const [showOTPDialog, setShowOTPDialog] = useState<boolean>(false)
	const router = useRouter()

	const { mutate, isPending } = useMutation({
		mutationFn: (data: SignUpProps) =>
			unAuthenticatedAxios.post(`/auth/register`, data),
		onError: (error: any) => {
			const errorMessage =
				error.response?.data?.message ||
				error?.message ||
				'Something went wrong'
			showToast({
				message: errorMessage,
				status: 'error',
			})
		},
		onSuccess: () => {
			showToast({
				message: 'Account created successfully!',
				status: 'success',
			})

			setShowOTPDialog(true)
		},
	})

	const { loginWithGoogle } = useAuthContext()
	const { setAuthState } = useAuthContext()
	const { showToast } = useCommon()

	const validationSchema = Yup.object({
		first_name: Yup.string().when('isSignUp', {
			is: true,
			then: (schema) => Yup.string().required('First name is required'),
		}),
		last_name: Yup.string().when('isSignUp', {
			is: true,
			then: (schema) => Yup.string().required('Last name is required'),
		}),
		email: Yup.string().email('Email is invalid').required('Email is required'),
		password: Yup.string()
			.min(6, 'Password must be at least 6 characters')
			.required('Password is required'),
	})

	const formik = useFormik({
		initialValues: {
			first_name: '',
			last_name: '',
			email: '',
			password: '',
		},
		validationSchema,
		onSubmit: async (values: SignUpProps) => {
			try {
				if (isSignUp) {
					mutate(values)
				} else {
					await signIn('credentials', {
						email: values.email,
						password: values.password,
						redirect: false,
					}).then((resp) => {
						if (resp?.error) {
							console.log('This is the error', resp?.error)
							showToast({
								message: resp?.error || 'Something went wrong',
								status: 'error',
							})
						} else {
							showToast({
								message: 'Login successful',
								status: 'success',
							})
							router.refresh()
							window.location.reload()
							setIsPasswordReset(false)
							setIsSignUp(false)
						}
					})
				}
			} catch (error) {
				console.error(error)
			}
		},
	})

	const handlePasswordVisibility = () => setShowPassword(!showPassword)

	return showOTPDialog ? (
		<OTPDialog
			email={formik.values.email}
			password={formik.values.password}
			onVerificationSuccess={() => setShowOTPDialog(false)}
		/>
	) : (
		<Box width="100%">
			<VStack spacing={6} width="100%">
				<Center mb={6}>
					<Text fontSize={'x-large'} fontWeight={'bold'}>
						{isSignUp ? 'Sign Up' : 'Login'}
					</Text>
				</Center>

				<form onSubmit={formik.handleSubmit}>
					<VStack spacing={2} width={'100%'}>
						{isSignUp && (
							<>
								<FormControl
									width="100%"
									isInvalid={
										formik.touched.first_name && !!formik.errors.first_name
									}
								>
									<FormLabel>First Name</FormLabel>
									<Input
										name="first_name"
										size={'lg'}
										type="text"
										value={formik.values.first_name}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										placeholder="Enter your first name"
									/>
									{formik.touched.first_name && formik.errors.first_name && (
										<FormErrorMessage>
											{formik.errors.first_name}
										</FormErrorMessage>
									)}
								</FormControl>

								<FormControl
									width="100%"
									isInvalid={
										formik.touched.last_name && !!formik.errors.last_name
									}
								>
									<FormLabel>Last Name</FormLabel>
									<Input
										name="last_name"
										size={'lg'}
										type="text"
										value={formik.values.last_name}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										placeholder="Enter your last name"
									/>
									{formik.touched.last_name && formik.errors.last_name && (
										<FormErrorMessage>
											{formik.errors.last_name}
										</FormErrorMessage>
									)}
								</FormControl>
							</>
						)}

						<FormControl
							width="100%"
							isInvalid={formik.touched.email && !!formik.errors.email}
						>
							<FormLabel>Email</FormLabel>
							<Input
								name="email"
								size={'lg'}
								type="email"
								value={formik.values.email}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								placeholder="Enter your email"
							/>
							{formik.touched.email && formik.errors.email && (
								<FormErrorMessage>{formik.errors.email}</FormErrorMessage>
							)}
						</FormControl>

						<FormControl
							isInvalid={formik.touched.password && !!formik.errors.password}
						>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									name="password"
									type={showPassword ? 'text' : 'password'}
									value={formik.values.password}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									placeholder="Enter your password"
								/>
								<InputRightElement>
									<Button onClick={handlePasswordVisibility}>
										{showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
									</Button>
								</InputRightElement>
							</InputGroup>
							{formik.touched.password && formik.errors.password && (
								<FormErrorMessage>{formik.errors.password}</FormErrorMessage>
							)}
						</FormControl>

						<Button
							isLoading={formik.isSubmitting || isPending}
							disabled={isPending}
							type="submit"
							bgColor="brand"
							mt={4}
							width="full"
						>
							{isSignUp ? 'Sign Up' : 'Login'}
						</Button>

						{!isSignUp && (
							<Box mt={2} width={'full'} textAlign={'center'}>
								<Text
									cursor={'pointer'}
									textDecoration="underline"
									onClick={() => setIsPasswordReset(true)}
								>
									Forgot password?
								</Text>
							</Box>
						)}

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
				<Button onClick={loginWithGoogle} leftIcon={<BiLogoGoogle />}>
					Sign in with Google
				</Button>
			</HStack>
		</Box>
	)
}
