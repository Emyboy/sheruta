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
import { doc } from 'firebase/firestore'
import { db } from '@/firebase'

export default function useHandleBookmark(
	object_id: string,
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
				
				const objectRef = doc(db, DBCollectionName.flatShareRequests, object_id);

				await Promise.all([
					BookmarkService.createBookmark({
						uuid,
						object_type: BookmarkType.requests,
						_object_ref: objectRef,
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
		}finally {
			await fetchBookmarks(authState.user?._id as string)
		}

		setIsBookmarkLoading(false)
	}

	const toggleSaveProfile = async () => {
		const uuid = crypto.randomUUID()

		if (!authState.flat_share_profile)
			return showToast({
				message: 'Login to save this profile',
				status: 'error',
			})

		if(object_id === recipient_id) {
			return showToast({
				message: 'You are not allowed to save your own profile',
				status: 'error',
			})
		}
 
		setBookmarkId(bookmarkId ? null : uuid)

		setIsBookmarkLoading(true)
		try {
			if (!bookmarkId) {

				const objectRef = doc(db, DBCollectionName.users, object_id);

				await Promise.all([
					BookmarkService.createBookmark({
						uuid,
						object_type: BookmarkType.profiles,
						_object_ref: objectRef,
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
					message: 'Successfully bookmarked profile',
					status: 'success',
				})
			} else {
				await BookmarkService.deleteBookmark({
					user_id: authState.flat_share_profile._user_id,
					document_id: bookmarkId,
				})

				setBookmarkId(null)

				showToast({
					message: 'Successfully removed profile from bookmarks',
					status: 'success',
				})
			}
		} catch (error) {
			console.error('Error toggling bookmark:', error)
			setBookmarkId(bookmarkId)
			showToast({
				message: 'Error occured while saving this profile',
				status: 'error',
			})
		} finally {
			await fetchBookmarks(authState.user?._id as string)
		}

		setIsBookmarkLoading(false)
	}

	useEffect(() => {
		if (!authState.user || !bookmarks.length) return

		const findBookmark = bookmarks.find(
			(bookmark) => bookmark._object_ref.id === object_id,
		)

		setBookmarkId(findBookmark?.id || null)
	}, [authState.user, bookmarks.length])

	return { toggleSaveApartment, toggleSaveProfile, bookmarkId, isBookmarkLoading }
}
