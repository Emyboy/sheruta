import React from 'react'
import AuthPopup from './AuthPopup'
import WelcomePopup from './WelcomePopup/WelcomePopup'

export default function MasterPopup() {
	return (
		<>
			<WelcomePopup />
			<AuthPopup />
		</>
	)
}
