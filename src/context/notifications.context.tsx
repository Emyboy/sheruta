'use client'

import { NotificationType } from '@/firebase/service/notifications/notifications.types'
import useCommon from '@/hooks/useCommon'
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'
import { useAuthContext } from './auth.context'

interface NotificationContextType {
	notifications: NotificationType[]
	unreadNotifications: boolean
	// updateNotification: (id: string) => Promise<void>
	// readAllNotifications: (ids: string[]) => Promise<void>
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
			notifications.some((notification) => notification.seen),
		)
	}, [notifications])

	return (
		<NotificationContext.Provider
			value={{
				unreadNotifications,
				notifications,
				// updateNotification,
				// readAllNotifications,
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
