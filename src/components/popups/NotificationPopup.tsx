'use client'
import { app } from '@/firebase'
import { getMessaging, getToken } from 'firebase/messaging'
const messaging = getMessaging(app)
import React, { useEffect } from 'react'

export default function NotificationPopup() {
	const handlePermission = async () => {
		try {
			const permission = await Notification.requestPermission()
			console.log('STARTING Notification ')
			if (permission === 'granted') {
				console.log('GRANTED')
				const token = await getToken(messaging, {
					vapidKey:
						'BFCGlp-evOJaDJtPHuR6rOfg5ykujzLNaEqepo8MPZN9aE5LB_qQAqSr1XiisbhQxapJ8Smmi5dJfAY6mKq1uy4',
				})
				console.log('FCM token:', token)
				// Send the token to your server to store it
			} else {
				console.error('Unable to get permission to notify')
			}
		} catch (error) {
			console.error('Unable to get permission to notify:', error)
		}
	}

	const showNotification = () => {
		new Notification('Testing notifications', {
			body: 'Looking good 👍🏽',
			icon: 'https://firebasestorage.googleapis.com/v0/b/sheruta-prod.appspot.com/o/DONT%20DELETE%2FLOGOS%2Ficon_green.png?alt=media&token=b48ad244-dfc9-4476-bbab-1b6ecbcacb9c',
			vibrate: [500, 200, 200, 200, 200, 200, 200, 200],
		})
	}

	useEffect(() => {
		// showNotification()
		setTimeout(() => {}, 10000)
		handlePermission()
	}, [])

	return <></>
}
