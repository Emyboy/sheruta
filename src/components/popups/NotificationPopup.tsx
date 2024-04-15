'use client'
import { app } from '@/firebase'
import { getMessaging, getToken } from 'firebase/messaging'
import React, { useEffect } from 'react'

const messaging = getMessaging(app)

export default function NotificationPopup() {
	// const showNotification = () => {
	// 	new Notification('Testing notifications', {
	// 		body: 'Looking good 👍🏽',
	// 		icon: 'https://firebasestorage.googleapis.com/v0/b/sheruta-prod.appspot.com/o/DONT%20DELETE%2FLOGOS%2Ficon_green.png?alt=media&token=b48ad244-dfc9-4476-bbab-1b6ecbcacb9c',
	// 		vibrate: [500, 200, 200, 200, 200, 200, 200, 200],
	// 	})
	// }

	useEffect(() => {
		;(async () => {
			const registerServiceWorker = async () => {
				if ('serviceWorker' in navigator) {
					try {
						window.addEventListener('load', () => {
							if ('serviceWorker' in navigator) {
								navigator.serviceWorker.register('/firebase-messaging-sw.js')
							}
						})
					} catch (error) {
						console.error('Service Worker registration failed:', error)
					}
				}
			}

			registerServiceWorker()
		})()
	}, [])

	return <></>
}
