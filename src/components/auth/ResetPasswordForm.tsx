'use client';

import { useState, ChangeEvent, FormEvent } from "react";
import {
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Button,
	VStack,
	Text,
	FormErrorMessage,
} from "@chakra-ui/react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useMutation } from '@tanstack/react-query'
import { unAuthenticatedAxios } from '@/utils/custom-axios'
import useCommon from "@/hooks/useCommon";
import { DEFAULT_PADDING } from "@/configs/theme";

type Props = {
	token: string;
}

const ResetPasswordForm: React.FC<Props> = ({ token }) => {

	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const { showToast } = useCommon()

	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
		setError("");
	};

	const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setConfirmPassword(e.target.value);
		setError("");
	};

	const { mutate: resetPassword, isPending } = useMutation({
		mutationFn: (data: { token: string, password: string }) =>
			unAuthenticatedAxios.put(`/auth/password/reset`, data),
		onError: (error: any) => {
			const errorMessage =
				error.response?.data?.message ||
				error?.message ||
				'Password Reset Failed'
			showToast({
				message: errorMessage,
				status: 'error',
			})
		},
		onSuccess: () => {
			showToast({
				message: 'Password reset was successful',
				status: 'success',
			}),
			setTimeout(() => {
				window.location.assign('/')
			}, 3000)
		},
	})

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}
		return resetPassword({ token, password })
	};

	return (
		<VStack as="form" p={DEFAULT_PADDING} spacing={4} onSubmit={handleSubmit} minH={"50dvh"}>
			<Text fontSize="2xl" fontWeight="bold">Reset your password</Text>
			<FormControl id="password" isRequired isInvalid={error !== ""}>
				<FormLabel>New Password</FormLabel>
				<InputGroup>
					<Input
						type={showPassword ? "text" : "password"}
						placeholder="Enter new password"
						value={password}
						onChange={handlePasswordChange}
					/>
					<InputRightElement width="3rem">
						<Button onClick={() => setShowPassword((show) => !show)}>
							{showPassword ? <BsEyeFill /> : <BsEyeSlashFill />}
						</Button>
					</InputRightElement>
				</InputGroup>
				<FormErrorMessage>{error}</FormErrorMessage>
			</FormControl>

			<FormControl id="confirm-password" isRequired isInvalid={error !== ""}>
				<FormLabel>Confirm New Password</FormLabel>
				<InputGroup>
					<Input
						type={showPassword ? "text" : "password"}
						placeholder="Confirm new password"
						value={confirmPassword}
						onChange={handleConfirmPasswordChange}
					/>
					<InputRightElement width="3rem">
						<Button onClick={() => setShowPassword((show) => !show)}>
							{showPassword ? <BsEyeFill /> : <BsEyeSlashFill />}
						</Button>
					</InputRightElement>
				</InputGroup>
				<FormErrorMessage>{error}</FormErrorMessage>
			</FormControl>

			<Button isDisabled={isPending} isLoading={isPending} w={"full"} bgColor="brand" type="submit">
				Reset Password
			</Button>
		</VStack>

	);
};

export default ResetPasswordForm;
