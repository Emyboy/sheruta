// usePayment.ts

import { useAuthContext } from '@/context/auth.context'
import FlatShareProfileService from '@/firebase/service/flat-share-profile/flat-share-profile.firebase'
import { FlatShareProfileData } from '@/firebase/service/flat-share-profile/flat-share-profile.types'
import { useToast } from '@chakra-ui/react'
import { useState } from 'react'

interface PaymentState {
	isLoading: boolean
}

interface PaymentActions {
	decrementCredit: (params: {
		amount: number
		user_id: string
	}) => Promise<FlatShareProfileData | null>
	incrementCredit: (params: {
		amount: number
		user_id: string
	}) => Promise<FlatShareProfileData | null>
}

type PaymentHook = () => [PaymentState, PaymentActions]

const usePayment: PaymentHook = () => {
	const toast = useToast()
	const { authState, setAuthState } = useAuthContext()
	const [paymentState, setPaymentState] = useState<PaymentState>({
		isLoading: false,
	})

	const decrementCredit = async ({
		amount,
		user_id,
	}: {
		amount: number
		user_id: string
	}): Promise<FlatShareProfileData | null> => {
		try {
			setPaymentState({ isLoading: true })
			let result = await FlatShareProfileService.decrementCredit({
				amount,
				user_id,
			})
			setPaymentState({ isLoading: false })
			if (result) {
				setAuthState({ flat_share_profile: result })
			}
			return result
		} catch (error) {
			toast({ title: 'Error, please try again', status: 'error' })
			setPaymentState({ isLoading: false })
			return Promise.reject(error)
		}
	}

	const incrementCredit = async ({
		amount,
		user_id,
	}: {
		amount: number
		user_id: string
	}): Promise<FlatShareProfileData | null> => {
		try {
			setPaymentState({ isLoading: true })
			let result = await FlatShareProfileService.incrementCredit({
				newCredit: amount,
				user_id,
			})
			setPaymentState({ isLoading: false })
			if (result) {
				setAuthState({ flat_share_profile: result })
			}
			return result
		} catch (error) {
			toast({ title: 'Error, please try again', status: 'error' })
			setPaymentState({ isLoading: false })
			return Promise.reject(error)
		}
	}

	const paymentActions: PaymentActions = {
		decrementCredit,
		incrementCredit,
	}

	return [paymentState, paymentActions]
}

export default usePayment
