'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface AppState {
	app_loading: boolean
	show_left_nav: boolean
	show_login: boolean
	show_credit: boolean
}

interface AppContextProps {
	appState: AppState
	setAppState: (newState: Partial<AppState>) => void
}

const AppContext = createContext<AppContextProps | undefined>(undefined)

interface AppContextProviderProps {
	children: ReactNode
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
	children,
}) => {
	const [state, setState] = useState<AppState>({
		app_loading: true,
		show_left_nav: false,
		show_login: false,
		show_credit: false,
	})

	const setAppState = (newState: Partial<AppState>): void => {
		setState({
			...state,
			...newState,
		})
	}

	return (
		<AppContext.Provider value={{ appState: state, setAppState }}>
			{children}
		</AppContext.Provider>
	)
}

export const useAppContext = (): AppContextProps => {
	const context = useContext(AppContext)
	if (!context) {
		throw new Error('useAppContext must be used within an AppContextProvider')
	}
	return context
}
