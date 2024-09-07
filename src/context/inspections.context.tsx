'use client'

import InspectionServices from '@/firebase/service/inspections/inspections.firebase'
import { returnedInspectionData } from '@/firebase/service/inspections/inspections.types'
import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'
import { useAuthContext } from './auth.context'
import InspectionReminderModal from '@/app/inspections/InspectionReminderModal'

interface InspectionsContextType {
	inspections: returnedInspectionData[]
	fetchYourInspections: (id: string) => Promise<void>
	loadingInspections: boolean
}

const InspectionsContext = createContext<InspectionsContextType | undefined>(
	undefined,
)

export const InspectionsProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const { authState } = useAuthContext()

	const [inspections, setInspections] = useState<returnedInspectionData[]>([])
	const [loadingInspections, setLoadingInspections] = useState(false)

	const fetchYourInspections = async (id: string) => {
		setLoadingInspections(true)
		try {
			const res = await InspectionServices.getYourInspections(id)
			setInspections(res as returnedInspectionData[])
		} catch (error) {
			console.error('Error', error)
		}
		setLoadingInspections(false)
	}

	useEffect(() => {
		if (!authState.user?._id) return

		fetchYourInspections(authState.user._id)
	}, [authState.user?._id])

	return (
		<InspectionsContext.Provider
			value={{ loadingInspections, inspections, fetchYourInspections }}
		>
			<InspectionReminderModal />
			{children}
		</InspectionsContext.Provider>
	)
}

export const useInspectionsContext = () => {
	const context = useContext(InspectionsContext)
	if (context === undefined) {
		throw new Error('useOptions must be used within an OptionsProvider')
	}
	return context
}
