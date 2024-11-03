// usePayment.ts

import { useAuthContext } from '@/context/auth.context'
import FlatShareProfileService from '@/firebase/service/flat-share-profile/flat-share-profile.firebase'
import { DBCollectionName } from '@/firebase/service/index.firebase'
import { ToastId, useToast } from '@chakra-ui/react'
import { AxiosResponse } from 'axios'
import { useState } from 'react'
import useAuthenticatedAxios from './useAxios'
import { useRouter } from 'next/navigation'

interface PaymentState {
	isLoading: boolean
}

interface PaymentActions {
	decrementCredit: (params: {
		amount: number
		user_id: string
	}) => Promise<boolean | ToastId>
	incrementCredit: (params: {
		amount: number
		transaction_id: string
	}) => Promise<ToastId | AxiosResponse<any, any>>
}

type PaymentHook = () => [PaymentState, PaymentActions]

const usePayment: PaymentHook = () => {
	const router = useRouter()

	const toast = useToast()
	const { authState, setAuthState } = useAuthContext()
	const [paymentState, setPaymentState] = useState<PaymentState>({
		isLoading: false,
	})

	const axiosInstance = useAuthenticatedAxios()

	const decrementCredit = async ({
		amount,
		user_id,
	}: {
		amount: number
		user_id: string
	}) => {
		if (!authState.flat_share_profile)
			return toast({ title: 'Error, please login and again', status: 'error' })

		try {
			setPaymentState({ isLoading: true })
			let result = await FlatShareProfileService.decrementCredit({
				collection_name: DBCollectionName.flatShareProfile,
				newCredit: amount,
				document_id: user_id,
			})
			setPaymentState({ isLoading: false })
			if (result) {
				router.refresh()
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
		transaction_id,
	}: {
		amount: number
		transaction_id: string
	}) => {
		if (!authState.flat_share_profile || !authState.wallet)
			return toast({ title: 'Error, please login and again', status: 'error' })

		try {
			setPaymentState({ isLoading: true })
			let result = await axiosInstance.post('/transactions/validate', {
				amount,
				type: 'credit',
				transaction_id,
			})
			setPaymentState({ isLoading: false })
			router.refresh()
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
