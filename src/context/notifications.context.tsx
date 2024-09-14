'use client'

import NotificationsService from '@/firebase/service/notifications/notifications.firebase'
import { returnedNotifications } from '@/firebase/service/notifications/notifications.types'
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'
import { useAuthContext } from './auth.context'
import useCommon from '@/hooks/useCommon'

interface NotificationContextType {
	notifications: returnedNotifications[]
	fetchNotifications: (id: string) => Promise<void>
	loadingNotifications: boolean
	unreadNotifications: boolean
	updateNotification: (id: string) => Promise<void>
	readAllNotifications: (ids: string[]) => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined,
)

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const { authState } = useAuthContext()
	const { showToast } = useCommon()

	const [notifications, setNotifications] = useState<returnedNotifications[]>(
		[],
	)
	const [unreadNotifications, setUnreadNotifications] = useState<boolean>(false)
	const [loadingNotifications, setLoadingNotifications] = useState(false)

	const fetchNotifications = async (id: string) => {
		setLoadingNotifications(true)

		try {
			const res = await NotificationsService.fetchNotifications(id)
			setNotifications(res as returnedNotifications[])

			// @ts-ignore
			setUnreadNotifications(res.some((notification) => !notification.is_read))
		} catch (error) {
			console.error('Error', error)
		}

		setLoadingNotifications(false)
	}

	const updateNotification = async (id: string) => {
		setLoadingNotifications(true)

		const updatedNotifications = notifications.map((notification) =>
			notification.id === id
				? { ...notification, is_read: true }
				: notification,
		)
		setNotifications(updatedNotifications)
		setUnreadNotifications(
			updatedNotifications.some((notification) => !notification.is_read),
		)

		try {
			await NotificationsService.readNotification(id)
		} catch (error) {
			console.error(error)
			showToast({
				message: 'Error updating notifications',
				status: 'error',
			})

			setNotifications(notifications)
		}

		setLoadingNotifications(false)
	}

	const readAllNotifications = async (ids: string[]) => {
		setLoadingNotifications(true)

		const updatedNotifications = notifications.map((notification) =>
			ids.includes(notification.id)
				? { ...notification, is_read: true }
				: notification,
		)
		setNotifications(updatedNotifications)
		setUnreadNotifications(false)

		try {
			await Promise.all(
				ids.map((id) => NotificationsService.readNotification(id)),
			)
		} catch (error) {
			console.error('Error reading all notifications:', error)
			showToast({
				message: 'Error updating notifications',
				status: 'error',
			})

			setNotifications(notifications)
			setUnreadNotifications(
				notifications.some((notification) => !notification.is_read),
			)
		}

		setLoadingNotifications(false)
	}

	useEffect(() => {
		if (!authState.user?._id) return

		fetchNotifications(authState.user._id)
	}, [authState.user?._id])

	return (
		<NotificationContext.Provider
			value={{
				loadingNotifications,
				unreadNotifications,
				notifications,
				fetchNotifications,
				updateNotification,
				readAllNotifications,
			}}
		>
			{children}
		</NotificationContext.Provider>
	)
}

export const useNotificationContext = () => {
	const context = useContext(NotificationContext)
	if (context === undefined) {
		throw new Error(
			'useNotifications must be used within an NotificationsProvider',
		)
	}
	return context
}
