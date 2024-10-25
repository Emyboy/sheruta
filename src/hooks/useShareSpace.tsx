import { useAuthContext } from '@/context/auth.context'
import { revalidatePathOnClient } from '@/utils/actions'
import { useState } from 'react'
import useAuthenticatedAxios from './useAxios'
import useCommon from './useCommon'

export default function useShareSpace() {
	const { showToast } = useCommon()
	const { authState } = useAuthContext()

	const [isLoading, setIsLoading] = useState(false)

	const axiosInstance = useAuthenticatedAxios()

	const copyShareUrl = async (
		url: string,
		title: string = '',
		text: string = '',
	): Promise<void> => {
		if (
			typeof window !== 'undefined' &&
			typeof window.location !== 'undefined'
		) {
			try {
				if (navigator?.share) {
					await navigator.share({
						title,
						text,
						url,
					})
				} else {
					await navigator.clipboard.writeText(window.location.origin + url)
					showToast({
						message: 'Link has been copied successfully',
						status: 'info',
					})
				}
			} catch (error) {
				showToast({
					message: 'Failed to share or copy the link. Please try again.',
					status: 'error',
				})
				console.error('Error sharing or copying URL:', error)
			}
		}
	}

	const handleDeletePost = async ({
		requestId,
		userId,
	}: {
		requestId: string
		userId: string
	}): Promise<void> => {
		try {
			setIsLoading(true)
			if (!axiosInstance) {
				return showToast({
					message: 'Failed to delete the post',
					status: 'error',
				})
			}

			if (authState.user?._id === userId && requestId) {
				await axiosInstance.delete(`/flat-share-requests/${requestId}`)

				showToast({
					message: 'Post has been deleted successfully',
					status: 'success',
				})

				revalidatePathOnClient()

				setTimeout(() => {
					window.location.assign('/')
				}, 1000)
			} else {
				showToast({
					message: 'You are not authorized to delete this post',
					status: 'error',
				})
			}
		} catch (err: any) {
			console.error('Error deleting post:', err)
			showToast({
				message: 'Failed to delete the post',
				status: 'error',
			})
		} finally {
			setIsLoading(false)
		}
	}

	return { copyShareUrl, handleDeletePost, isLoading, setIsLoading }
}
