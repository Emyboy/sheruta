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
import { auth } from '@/firebase'
import AuthService from '@/firebase/service/auth/auth.firebase'
import { useToast } from '@chakra-ui/react'
import { useAppContext } from './app.context'

interface AuthState {
	user: AuthUser | null
	user_info: UserInfo | null
	user_settings: null
	flat_share_profile: null
	auth_loading?: boolean
}

interface AuthContextProps {
	authState: AuthState
	setAuthState: (state: AuthState) => void
	getUser: () => AuthUser | null
	createUser: (user: RegisterDTO) => void
	logout: () => void
	loginWithGoogle: () => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

interface AuthContextProviderProps {
	children: ReactNode
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
	children,
}) => {
	const toast = useToast()
	const { setAppState } = useAppContext()
	const [state, setState] = useState<AuthState>({
		user: null,
		user_info: null,
		user_settings: null,
		flat_share_profile: null,
		auth_loading: false,
	})

	const getUser = (): AuthUser | null => {
		return state.user
	}

	const setAuthState = (newState: Partial<AuthState>): void => {
		setState({
			...state,
			...newState,
		})
	}

	const createUser = (user: RegisterDTO): void => {
		// setState({ user, user_info: userInfo })
	}

	const logout = async () => {
		await auth.signOut()
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
				console.log('USER CREATED::', error)
				toast({ title: 'Error, please try again', status: 'error' })
			})
	}

	useEffect(() => {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				let userData = await AuthService.getUser(user.uid)
				setAuthState({ ...userData })
				setAppState({ app_loading: false })
			} else {
				setAppState({ app_loading: false })
			}
		})
	}, [])

	return (
		<AuthContext.Provider
			value={{
				authState: state,
				setAuthState,
				getUser,
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
