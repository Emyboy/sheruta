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

const initialOptionsState: OptionsState = {
	location_keywords: [],
	states: [],
	services: [],
	habits: [],
	interests: [],
	categories: [],
	property_types: [],
	amenities: [],
}

export const OptionsProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const { setAppState } = useAppContext()
	const [optionsState, setOptionsState] =
		useState<OptionsState>(initialOptionsState)

	const updateOptionsState = (newState: Partial<OptionsState>) => {
		setOptionsState((prevState) => ({ ...prevState, ...newState }))
	}

	useEffect(() => {
		;(async () => {
			setAppState({ app_loading: true })
			const optionsCollections = [
				DBCollectionName.locationKeyWords,
				DBCollectionName.states,
				DBCollectionName.services,
				DBCollectionName.habits,
				DBCollectionName.interests,
				DBCollectionName.categories,
				DBCollectionName.propertyTypes,
				DBCollectionName.amenities,
			]

			const optionPromises = optionsCollections.map(async (collectionName) => {
				const querySnapshot = await getDocs(collection(db, collectionName))
				const options = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					_ref: doc.ref,
					...doc.data(),
				}))
				return { [collectionName]: options }
			})

			const results = await Promise.all(optionPromises)
			const options: OptionsState = Object.assign({}, ...results)

			console.log('THE OPTIONS::', options)

			setOptionsState(options)
			setAppState({ app_loading: false })
		})()
	}, [])

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
