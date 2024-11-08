'use client'
import { AuthUser, RegisterDTO } from '@/firebase/service/auth/auth.types'
import { UserInfo } from '@/firebase/service/user-info/user-info.types'
import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from 'react'
import {
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
} from 'firebase/auth'
import { app, auth } from '@/firebase'
import AuthService from '@/firebase/service/auth/auth.firebase'
import { useToast } from '@chakra-ui/react'
import { useAppContext } from './app.context'
import { FlatShareProfileData } from '@/firebase/service/flat-share-profile/flat-share-profile.types'
import axiosInstance from '@/utils/custom-axios'
import useAuthenticatedAxios from '@/hooks/useAxios'
import { signOut } from 'next-auth/react'

export interface AuthState {
	user: AuthUser | null
	user_info: UserInfo | null
	user_settings: any
	wallet: any
	flat_share_profile: null | FlatShareProfileData
	notifications: any
	auth_loading?: boolean
}

interface AuthContextProps {
	authState: AuthState
	setAuthState: (state: Partial<AuthState>) => void
	getAuthDependencies: () => void
	createUser: (user: RegisterDTO) => void
	logout: () => void
	loginWithGoogle: () => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

interface AuthContextProviderProps {
	children: ReactNode
	user_data: any
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
	children,
	user_data,
}) => {
	const signin = useAuthenticatedAxios()

	const toast = useToast()
	const { setAppState } = useAppContext()
	const [state, setState] = useState<AuthState>(
		user_data
			? { ...user_data }
			: {
					user: null,
					user_info: null,
					user_settings: null,
					wallet: null,
					flat_share_profile: null,
					notifications: [],
					auth_loading: false,
				},
	)

	const getAuthDependencies = async (): Promise<any> => {
		// if (state.user) {
		// 	console.log('GETTING AUTH DEPENDENCIES')
		// 	let userData = await AuthService.getUser(state.user._id)
		// 	setAuthState({ ...userData })
		// 	return userData
		// } else {
		// 	return Promise.reject('User not found')
		// }

		if (!signin) return null

		const { data } = await signin.get(`/users/dependencies`)
		// console.log(data)
		// @ts-ignore
		setAuthState((prev) => ({ ...prev, ...data.user_data }))
	}

	const setAuthState = (newState: Partial<AuthState>): void => {
		setState((prevState) => ({
			...prevState,
			...newState,
		}))
	}

	const createUser = (user: RegisterDTO): void => {
		// setState({ user, user_info: userInfo })
	}

	const logout = async () => {
		signOut()
		localStorage.clear()
		sessionStorage.clear()
		window.location.reload()
	}

	const loginWithGoogle = async () => {
		const provider = new GoogleAuthProvider()
		signInWithPopup(auth, provider)
			.then(async (result) => {
				setAuthState({
					auth_loading: true,
				})
				const user = result.user

				let data: RegisterDTO = {
					displayName: user.displayName || '',
					email: user.email || '',
					photoURL: user.photoURL || null,
					providerId: 'google',
					uid: user.uid,
					phoneNumber: user.phoneNumber,
				}

				if (!data.displayName || !data.email || !data.uid) {
					return toast({
						title: 'Error: Please try another email',
						status: 'error',
					})
				}

				let theUser = await AuthService.loginUser(data)

				setAuthState({ ...(theUser as any), auth_loading: false })
			})
			.catch((error) => {
				console.log('LOGIN ERROR::', error)
				toast({ title: 'Error, please try again', status: 'error' })
			})
	}

	// useEffect(() => {
	// 	// onAuthStateChanged(auth, async (user) => {
	// 	// 	if (user) {
	// 	// 		let userData = await AuthService.getUser(user.uid)
	// 	// 		setAuthState({ ...userData })
	// 	// 		setAppState({ app_loading: false })
	// 	// 	} else {
	// 	// 		setAppState({ app_loading: false })
	// 	// 	}
	// 	// })
	// }, [])

	return (
		<AuthContext.Provider
			value={{
				authState: state,
				setAuthState,
				getAuthDependencies,
				createUser,
				logout,
				loginWithGoogle,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuthContext = (): AuthContextProps => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within an AuthContextProvider')
	}
	return context
}
