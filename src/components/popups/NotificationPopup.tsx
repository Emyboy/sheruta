import React, { useEffect } from 'react'

export default function NotificationPopup() {
	const handlePermissionRequest = () => {
		if (Notification.permission !== 'granted') {
			Notification.requestPermission().then((permission) => {
				if (permission === 'granted') {
					showNotification()
				} else {
					console.log('Notification permission denied')
				}
			})
		} else {
			showNotification()
		}
	}

	const showNotification = () => {
		new Notification('Testing notifications', {
			body: 'Looking good 👍🏽',
		})
	}

	useEffect(() => {
		setTimeout(() => {
			// handlePermissionRequest()
		}, 10000)
	}, [])

	return <></>
}
