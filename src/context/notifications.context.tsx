'use client'

import { NotificationType } from '@/firebase/service/notifications/notifications.types'
import axiosInstance from '@/utils/custom-axios'
import { AxiosResponse } from 'axios'
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'

interface NotificationContextType {
	notifications: NotificationType[]
	unreadNotifications: boolean
	// updateNotification: (id: string) => Promise<void>
	markAsRead: () => Promise<AxiosResponse<any, any>>
}

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined,
)

export const NotificationsProvider: React.FC<{
	children: ReactNode
	userNotifications: {
		notifications: NotificationType[]
	}
}> = ({ children, userNotifications }) => {
	const [notifications, setNotifications] = useState<NotificationType[]>(
		userNotifications.notifications || [],
	)
	const [unreadNotifications, setUnreadNotifications] = useState<boolean>(false)

	console.log(notifications)

	useEffect(() => {
		setUnreadNotifications(
			notifications.some((notification) => !notification.seen),
		)
	}, [notifications])

	const markAsRead = async () =>
		await axiosInstance.put('/notifications/mark-all-as-seen')

	return (
		<NotificationContext.Provider
			value={{
				unreadNotifications,
				notifications,
				// updateNotification,
				markAsRead,
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
