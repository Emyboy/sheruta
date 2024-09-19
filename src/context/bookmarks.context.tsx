'use client'
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'
import { useAuthContext } from './auth.context'
import useCommon from '@/hooks/useCommon'
import {
	BookmarkDataDetails,
	BookmarkType,
} from '@/firebase/service/bookmarks/bookmarks.types'
import { DocumentReference, getDoc } from 'firebase/firestore'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import { AuthUser } from '@/firebase/service/auth/auth.types'
import BookmarkService from '@/firebase/service/bookmarks/bookmarks.firebase'
import FlatShareProfileService from '@/firebase/service/flat-share-profile/flat-share-profile.firebase'
import { v4 as generateUId } from 'uuid'
import { resolveSingleObjectReferences } from '@/utils/index.utils'

interface NotificationContextType {
	bookmarks: BookmarkDataDetails[]
	fetchBookmarks: (userId: string) => Promise<void>
	deleteBookmark: (bookmarkId: string) => Promise<void>
	getBookmarkStatusAndId: (
		objectId: string,
	) => Promise<{ isBookmarked: boolean; bookmarkId: string | null }>
	updateBookmark: ({
		objectType,
		objectRef,
	}: {
		objectType: BookmarkType
		objectRef: DocumentReference
	}) => Promise<void>
	bookmarkLoading: boolean
}

const BookmarkContext = createContext<NotificationContextType | undefined>(
	undefined,
)

const resolveUserInfoFromUserRef = async (userRef: DocumentReference) => {
	const docSnap = await getDoc(userRef)
	if (docSnap.exists()) {
		const docData = docSnap.data() as AuthUser
		return await UserInfoService.get(docData._id as string)
	}
	return null
}

export const BookmarksProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const {
		authState: { user, flat_share_profile },
	} = useAuthContext()
	const [bookmarks, setBookmarks] = useState<BookmarkDataDetails[]>([])
	const [bookmarkLoading, setBookmarkLoading] = useState(false)
	const { showToast } = useCommon()

	const fetchBookmarks = async (userId: string) => {
		setBookmarkLoading(true)
		try {
			if (userId) {
				const userBookmarks = (await BookmarkService.getUserBookmarks(
					userId,
				)) as BookmarkDataDetails[]

				if (!userBookmarks || userBookmarks.length === 0) {
					setBookmarks([])
					return
				}

				const resolvedBookmarks = await Promise.all(
					userBookmarks.map(async (bookmark) => {
						try {
							if (
								bookmark.object_type === 'request' &&
								bookmark._object_ref?._user_ref
							) {
								const user_info = await resolveUserInfoFromUserRef(
									bookmark._object_ref._user_ref as DocumentReference,
								)
								const resolvedRefs = await resolveSingleObjectReferences(
									bookmark._object_ref,
								)

								return {
									...bookmark,
									_object_ref: {
										...bookmark._object_ref,
										...resolvedRefs,
										user_info,
									},
								}
							} else if (bookmark.object_type === 'profile') {
								const userId = bookmark._object_ref.id
								const flatShareProfile =
									await FlatShareProfileService.get(userId)
								const resolvedRefs = flatShareProfile
									? await resolveSingleObjectReferences(flatShareProfile)
									: {}

								return {
									...bookmark,
									_object_ref: {
										...bookmark._object_ref,
										flat_share_profile: {
											...flatShareProfile,
											...resolvedRefs,
										},
									},
								}
							}
						} catch (error) {
							console.error(
								`Error resolving bookmark ID: ${bookmark.id}`,
								error,
							)
							return bookmark
						}

						return bookmark // Fallback to original bookmark if no type matches
					}),
				)

				setBookmarks(resolvedBookmarks.filter(Boolean) as BookmarkDataDetails[])
			} else {
				setBookmarks([])
			}
		} catch (error) {
			console.error('Error fetching bookmarks:', error)
		} finally {
			setBookmarkLoading(false)
		}
	}

	const updateBookmark = async ({
		objectType,
		objectRef,
	}: {
		objectType: BookmarkType
		objectRef: DocumentReference
	}) => {
		try {
			if (!(user && user?._id)) {
				return showToast({
					message: 'Please login to perform this action',
					status: 'error',
				})
			}

			setBookmarkLoading(true)
			const uuid = generateUId()
			await BookmarkService.createBookmark({
				object_type: objectType,
				_object_ref: objectRef,
				_user_ref: flat_share_profile?._user_ref,
				uuid,
			})
			setBookmarkLoading(false)
			await fetchBookmarks(user._id)

			return showToast({
				message: 'Bookmark added successfully',
				status: 'success',
			})
		} catch (err) {
			showToast({
				message: 'Failed to update bookmark',
				status: 'error',
			})
		}
	}

	const deleteBookmark = async (bookmarkId: string): Promise<void> => {
		try {
			if (!(user && user?._id)) {
				return showToast({
					message: 'Please login to perform this action',
					status: 'error',
				})
			}

			setBookmarkLoading(true)
			await BookmarkService.deleteBookmark({
				user_id: user._id,
				document_id: bookmarkId,
			})
			await fetchBookmarks(user._id)
			setBookmarkLoading(false)

			return showToast({
				message: 'Bookmark removed successfully',
				status: 'success',
			})
		} catch (err) {
			showToast({
				message: 'Failed to update bookmark',
				status: 'error',
			})
		}
	}

	const getBookmarkStatusAndId = async (
		objectId: string,
	): Promise<{ isBookmarked: boolean; bookmarkId: string | null }> => {
		try {
			if (!user || !user._id) {
				return { isBookmarked: false, bookmarkId: null }
			}

			const userBookmarks = (await BookmarkService.getUserBookmarks(
				user._id,
			)) as BookmarkDataDetails[]

			const bookmark = userBookmarks.find(
				(bookmark) => bookmark._object_ref?.id === objectId,
			)

			return {
				isBookmarked: !!bookmark,
				bookmarkId: bookmark ? bookmark.id : null,
			}
		} catch (err) {
			console.error('Error retrieving bookmark status and ID:', err)
			return { isBookmarked: false, bookmarkId: null }
		}
	}

	useEffect(() => {
		if (!user?._id) return
		fetchBookmarks(user._id)
	}, [user?._id])

	return (
		<BookmarkContext.Provider
			value={{
				bookmarkLoading,
				fetchBookmarks,
				bookmarks,
				updateBookmark,
				deleteBookmark,
				getBookmarkStatusAndId,
			}}
		>
			{children}
		</BookmarkContext.Provider>
	)
}

export const useBookmarkContext = () => {
	const context = useContext(BookmarkContext)
	if (context === undefined) {
		throw new Error(
			'useBookmarkContext must be used within the BookmarksProvider',
		)
	}
	return context
}
