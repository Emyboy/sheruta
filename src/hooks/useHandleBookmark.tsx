'use client'

import { useAuthContext } from '@/context/auth.context'
import { useBookmarkContext } from '@/context/bookmarks.context'
import BookmarkService from '@/firebase/service/bookmarks/bookmarks.firebase'
import { BookmarkType } from '@/firebase/service/bookmarks/bookmarks.types'
import { DBCollectionName } from '@/firebase/service/index.firebase'
import NotificationsService, {
	NotificationsBodyMessage,
} from '@/firebase/service/notifications/notifications.firebase'
import { useEffect, useState } from 'react'
import useCommon from './useCommon'

export default function useHandleBookmark(
	request_id: string,
	recipient_id: string,
) {
	const { bookmarks, fetchBookmarks } = useBookmarkContext()
	const { authState } = useAuthContext()
	const { showToast } = useCommon()

	const [bookmarkId, setBookmarkId] = useState<string | null>(null)
	const [isBookmarkLoading, setIsBookmarkLoading] = useState(false)

	const toggleSaveApartment = async () => {
		const uuid = crypto.randomUUID()

		if (!authState.flat_share_profile)
			return showToast({
				message: 'Login to save an apartment',
				status: 'error',
			})

		setBookmarkId(bookmarkId ? null : uuid)

		setIsBookmarkLoading(true)
		try {
			if (!bookmarkId) {
				await Promise.all([
					BookmarkService.createBookmark({
						uuid,
						object_type: BookmarkType.requests,
						request_id,
						_user_ref: authState.flat_share_profile._user_ref,
					}),
					NotificationsService.create({
						collection_name: DBCollectionName.notifications,
						data: {
							type: 'bookmark',
							message: NotificationsBodyMessage.bookmark,
							recipient_id,
							sender_details: authState.user
								? {
										id: authState.user._id,
										avatar_url: authState.user.avatar_url,
										first_name: authState.user.first_name,
										last_name: authState.user.last_name,
									}
								: null,
							is_read: false,
							action_url: `/messages/${authState.flat_share_profile._user_id}`,
						},
					}),
				])

				showToast({
					message: 'Successfully bookmarked apartment',
					status: 'success',
				})
			} else {
				await BookmarkService.deleteBookmark({
					user_id: authState.flat_share_profile._user_id,
					document_id: bookmarkId,
				})

				setBookmarkId(null)

				showToast({
					message: 'Successfully removed apartment from bookmarks',
					status: 'success',
				})
			}
		} catch (error) {
			console.error('Error toggling bookmark:', error)
			setBookmarkId(bookmarkId)
			showToast({
				message: 'error saving this apartment',
				status: 'error',
			})

			await fetchBookmarks(authState.flat_share_profile._user_id)
		}

		setIsBookmarkLoading(false)
	}

	useEffect(() => {
		if (!authState.user || !bookmarks.length) return

		const findBookmark = bookmarks.find(
			(bookmark) => bookmark._object_ref.uuid === request_id,
		)

		setBookmarkId(findBookmark?.id || null)
	}, [authState.user, bookmarks.length])

	return { toggleSaveApartment, bookmarkId, isBookmarkLoading }
}
