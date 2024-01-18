import { AuthUser, RegisterDTO } from '@/firebase/service/auth/auth.types'
import { UserInfo } from '@/firebase/service/user-info/user-info.types'
import React, { createContext, useContext, useState, ReactNode } from 'react'

interface AuthState {
	user: AuthUser | null
    user_info: UserInfo | null
}

interface AuthContextProps {
	authState: AuthState
	setAuthState: (state: AuthState) => void
	getUser: () => AuthUser | null
	createUser: (user: RegisterDTO) => void
	logout: () => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

interface AuthProviderProps {
	children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [state, setState] = useState<AuthState>({
		user: null,
		user_info: null,
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

	const logout = (): void => {
		setState({ user: null, user_info: null })
	}

	return (
		<AuthContext.Provider
			value={{ authState: state, setAuthState, getUser, createUser, logout }}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = (): AuthContextProps => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
