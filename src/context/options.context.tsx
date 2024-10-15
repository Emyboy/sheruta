'use client'

import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'
import { useAppContext } from './app.context'

type OptionType = {
	_id: string
	name: string
}

export interface OptionsState {
	location_keywords: OptionType[]
	locations: (OptionType & { state: string })[]
	states: OptionType[]
	services: OptionType[]
	habits: OptionType[]
	interests: OptionType[]
	categories: OptionType[]
	property_types: OptionType[]
	amenities: OptionType[]
	work_industries: OptionType[]
}

interface OptionsContextType {
	optionsState: OptionsState
	setOptionsState: (newState: Partial<OptionsState>) => void
}

const OptionsContext = createContext<OptionsContextType | undefined>(undefined)

const initialOptionsState: OptionsState = {
	location_keywords: [],
	locations: [],
	states: [],
	services: [],
	habits: [],
	interests: [],
	categories: [],
	property_types: [],
	amenities: [],
	work_industries: [],
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
