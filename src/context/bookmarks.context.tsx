'use client'

import BookmarkService from '@/firebase/service/bookmarks/bookmarks.firebase'
import { BookmarkDataDetails } from '@/firebase/service/bookmarks/bookmarks.types'
import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'
import { useAuthContext } from './auth.context'

interface InspectionsContextType {
	bookmarks: BookmarkDataDetails[]
	fetchBookmarks: (id: string) => Promise<void>
	loadingBookmarks: boolean
}

const BookmarksContext = createContext<InspectionsContextType | undefined>(
	undefined,
)

export const BookmarksProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const { authState } = useAuthContext()

	const [bookmarks, setBookmarks] = useState<BookmarkDataDetails[]>([])
	const [loadingBookmarks, setLoadingBookmarks] = useState(false)

	const fetchBookmarks = async (id: string) => {
		setLoadingBookmarks(true)
		try {
			const res = await BookmarkService.getUserBookmarks(id)

			setBookmarks(res)
		} catch (error) {
			console.error('Error', error)
		}
		setLoadingBookmarks(false)
	}

	useEffect(() => {
		if (!authState.user?._id) return

		fetchBookmarks(authState.user._id)
	}, [authState.user?._id])

	return (
		<BookmarksContext.Provider
			value={{ bookmarks, loadingBookmarks, fetchBookmarks }}
		>
			{children}
		</BookmarksContext.Provider>
	)
}

export const useBookmarksContext = () => {
	const context = useContext(BookmarksContext)
	if (context === undefined) {
		throw new Error('useBookmarks must be used within an BookmarksProvider')
	}
	return context
}
