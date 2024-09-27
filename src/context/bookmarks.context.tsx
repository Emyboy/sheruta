'use client'

import BookmarkService from '@/firebase/service/bookmarks/bookmarks.firebase'
import {
	BookmarkDataDetails,
	BookmarkType,
} from '@/firebase/service/bookmarks/bookmarks.types'
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'
import { useAuthContext } from './auth.context'
import FlatShareProfileService from '@/firebase/service/flat-share-profile/flat-share-profile.firebase'
import { resolveSingleObjectReferences } from '@/utils/index.utils'

interface BookmarksContextType {
	bookmarks: BookmarkDataDetails[]
	fetchBookmarks: (userId: string) => Promise<void>
	bookmarkLoading: boolean
}

const BookmarkContext = createContext<BookmarksContextType | undefined>(
	undefined,
)

export const BookmarksProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const {
		authState: { user },
	} = useAuthContext()
	const [bookmarks, setBookmarks] = useState<BookmarkDataDetails[]>([])
	const [bookmarkLoading, setBookmarkLoading] = useState(false)

	const fetchBookmarks = async (userId: string) => {
		setBookmarkLoading(true)
		try {
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
							bookmark.object_type === BookmarkType.profiles &&
							bookmark._object_ref?.id
						) {
							const profileId = bookmark._object_ref.id
							const flatShareProfile =
								await FlatShareProfileService.get(profileId)
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
						} else {
							return bookmark
						}
					} catch (error) {
						console.error(`Error resolving bookmark ID: ${bookmark.id}`, error)
						return bookmark
					}
				}),
			)

			setBookmarks(resolvedBookmarks.filter(Boolean) as BookmarkDataDetails[])
		} catch (error) {
			console.error('Error fetching bookmarks:', error)
		} finally {
			setBookmarkLoading(false)
		}
	}

	useEffect(() => {
		if (!user?._id) return

		fetchBookmarks(user._id)
	}, [, user?._id])

	return (
		<BookmarkContext.Provider
			value={{
				bookmarkLoading,
				fetchBookmarks,
				bookmarks,
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
