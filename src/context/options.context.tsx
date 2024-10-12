'use client'
import { db } from '@/firebase'
import { DBCollectionName } from '@/firebase/service/index.firebase'
import { collection, getDocs } from 'firebase/firestore'
import React, {
	createContext,
	useState,
	useContext,
	ReactNode,
	useEffect,
} from 'react'
import { useAppContext } from './app.context'

export interface OptionsState {
	location_keywords: any[]
	locations: any[]
	states: any[]
	services: any[]
	habits: any[]
	interests: any[]
	categories: any[]
	property_types: any[]
	amenities: any[]
}

interface OptionsContextType {
	optionsState: OptionsState
	setOptionsState: (newState: Partial<OptionsState>) => void
}

const OptionsContext = createContext<OptionsContextType | undefined>(undefined)

const initialOptionsState: Omit<OptionsState, 'locations'> = {
	location_keywords: [],
	states: [],
	services: [],
	habits: [],
	interests: [],
	categories: [],
	property_types: [],
	amenities: [],
}

export const OptionsProvider: React.FC<{
	children: ReactNode
	options: any
}> = ({ children, options }) => {
	const { setAppState } = useAppContext()
	const [optionsState, setOptionsState] = useState<OptionsState>(
		options || initialOptionsState,
	)

	const updateOptionsState = (newState: Partial<OptionsState>) => {
		setOptionsState((prevState) => ({ ...prevState, ...newState }))
	}

	useEffect(() => {
		setAppState({ app_loading: true })
		if (options) {
			setOptionsState(options)
		}
		setAppState({ app_loading: false })
	}, [options])

	return (
		<OptionsContext.Provider
			value={{ optionsState, setOptionsState: updateOptionsState }}
		>
			{children}
		</OptionsContext.Provider>
	)
}

export const useOptionsContext = () => {
	const context = useContext(OptionsContext)
	if (context === undefined) {
		throw new Error('useOptions must be used within an OptionsProvider')
	}
	return context
}
