import BookInspectionBadge from '@/assets/svg/book-inspection-badge'
import { DEFAULT_PADDING } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
import { useInspectionsContext } from '@/context/inspections.context'
import { returnedInspectionData } from '@/firebase/service/inspections/inspections.types'
import {
	Button,
	Flex,
	Modal,
	ModalContent,
	ModalOverlay,
	Text,
	useDisclosure,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const reminders = [30000, 900000, 360000, 2160000]

const getLastReminderTime = (inspectionId: string) => {
	return localStorage.getItem(`lastReminder_${inspectionId}`)
}

const setLastReminderTime = (inspectionId: string, time: number) => {
	localStorage.setItem(`lastReminder_${inspectionId}`, time.toString())
}

const InspectionReminderModal = () => {
	const { inspections } = useInspectionsContext()
	const { authState } = useAuthContext()
	const router = useRouter()
	const [upcomingInspection, setUpcomingInspection] =
		useState<returnedInspectionData | null>(null)
	const { isOpen, onOpen, onClose } = useDisclosure()

	useEffect(() => {
		const checkInspections = () => {
			const now = new Date().getTime()
			let nextCheckTime = Infinity

			for (const inspection of inspections) {
				const inspectionDate = inspection.inspection_date.toDate().getTime()
				const timeLeft = inspectionDate - now

				if (timeLeft < 0) continue

				const lastReminder = getLastReminderTime(inspection.id)

				for (const reminder of reminders) {
					const reminderTime = timeLeft - reminder

					if (reminderTime <= 0 && lastReminder !== reminder.toString()) {
						setUpcomingInspection(inspection)
						onOpen()
						setLastReminderTime(inspection.id, reminder)
						break
					} else if (reminderTime > 0) {
						nextCheckTime = Math.min(nextCheckTime, now + reminderTime)
						break
					}
				}
			}

			return nextCheckTime !== Infinity ? nextCheckTime - now : null
		}

		const scheduleNextCheck = () => {
			const nextCheck = checkInspections()
			if (nextCheck !== null) {
				return setTimeout(scheduleNextCheck, Math.max(nextCheck, 60000))
			}
		}

		const timeoutId = scheduleNextCheck()

		return () => clearTimeout(timeoutId)
	}, [inspections, onOpen])

	if (!upcomingInspection) return null

	return (
		<Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
			<ModalOverlay />
			<ModalContent
				overflowY={'auto'}
				flexDir={'column'}
				alignItems={'center'}
				justifyContent={'center'}
				position={'relative'}
				rounded={'16px'}
				_dark={{ bgColor: 'black' }}
				_light={{
					bgColor: '#FDFDFD',
					border: '1px',
					borderColor: 'text_muted',
				}}
				py={{ base: '16px', md: '24px' }}
				px={{ base: '16px', sm: '24px', md: '32px' }}
				gap={{ base: '24px', md: '32px' }}
				as={'form'}
			>
				<Flex
					alignItems={'center'}
					justifyContent={'center'}
					w={'120px'}
					h={'120px'}
					rounded={'full'}
					bgColor={'#E4FAA833'}
				>
					<BookInspectionBadge />
				</Flex>
				<Text
					fontWeight={'300'}
					fontSize={{ base: '20px', md: '24px' }}
					_dark={{ color: 'white' }}
					_light={{ color: '#111717' }}
					textAlign={'center'}
				>
					You have an upcoming inspection with{' '}
					{authState.user?._id === upcomingInspection.seeker_details.id
						? `${upcomingInspection.host_details.last_name} ${upcomingInspection.host_details.first_name}`
						: `${upcomingInspection.seeker_details.last_name} ${upcomingInspection.seeker_details.first_name}`}{' '}
					at {upcomingInspection.inspection_date.toDate().toLocaleTimeString()}
				</Text>

				<Flex
					gap={{ base: '20px', md: '32px' }}
					justifyContent={'center'}
					flexWrap={'wrap'}
					mb={{ base: '32px', md: 0 }}
				>
					<Button
						rounded={DEFAULT_PADDING}
						paddingX={'50px'}
						paddingY={'16px'}
						h={{ base: '48px', md: '54px' }}
						bgColor={'transparent'}
						textColor={'brand'}
						border={'1px'}
						borderColor={'brand'}
						onClick={onClose}
						fontWeight={500}
						fontSize={{ base: 'sm', md: 'base' }}
					>
						Close
					</Button>
					<Button
						rounded={DEFAULT_PADDING}
						type="submit"
						paddingX={'50px'}
						paddingY={'16px'}
						h={{ base: '48px', md: '54px' }}
						bgColor={'#00BC7399'}
						textColor={'white'}
						fontSize={{ base: 'sm', md: 'base' }}
						onClick={() => router.push('/inspections')}
					>
						View Inspections
					</Button>
				</Flex>
			</ModalContent>
		</Modal>
	)
}

export default InspectionReminderModal
