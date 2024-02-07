'use client'
import { useAuthContext } from '@/context/auth.context'
import { Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react'
import React, { useState } from 'react'
import WelcomeMessage from './WelcomeMessage'
import ProfileConfig from './ProfileConfig'
import OnboardingForm from './OnboardingForm'

export default function WelcomePopup() {
	const { authState } = useAuthContext()
	const { flat_share_profile, user, user_info } = authState
	const [step, setStep] = useState(0)

	if (!flat_share_profile || !user || !user_info) {
		return null
	}

	const { first_name, last_name } = user

	if (
		first_name &&
		last_name &&
		flat_share_profile.budget &&
		flat_share_profile.seeking !== null &&
		user_info.primary_phone_number
	) {
		return null
	}

	const next = () => {
		setStep(step + 1)
	}

	return (
		<>
			<Modal isOpen onClose={() => {}} size="lg">
				<ModalOverlay />
				<ModalContent
					shadow={'xl'}
					border={'1px'}
					borderColor={'dark_light'}
					bg={'white'}
					_dark={{
						bg: 'dark',
					}}
				>
					<ModalBody p={0}>
						{
							[
								<WelcomeMessage next={next} key={Math.random()} />,
								<ProfileConfig next={next} key={Math.random()} />,
								<OnboardingForm next={next} key={Math.random()} />,
							][step]
						}
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	)
}
