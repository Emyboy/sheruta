'use client'

import BookmarkService from '@/firebase/service/bookmarks/bookmarks.firebase'
import { BookmarkDataDetails } from '@/firebase/service/bookmarks/bookmarks.types'
import useCommon from '@/hooks/useCommon'
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'
import { useAuthContext } from './auth.context'

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

	const fetchBookmarks = async (id: string) => {
		setBookmarkLoading(true)

		try {
			const res = await BookmarkService.getUserBookmarks(id)

			setBookmarks(res)
		} catch (error) {
			console.error('Error fetching bookmarks:', error)
		} finally {
			setBookmarkLoading(false)
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
