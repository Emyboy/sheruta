

import BookInspectionBadge from '@/assets/svg/book-inspection-badge'
import CloseIcon from '@/assets/svg/close-icon-dark'
import Spinner from '@/components/atoms/Spinner'
import { DEFAULT_PADDING } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
import { DBCollectionName } from '@/firebase/service/index.firebase'
import InspectionServices from '@/firebase/service/inspections/inspections.firebase'
import {
	InspectionData,
	InspectionDataSchema,
	returnedInspectionData,
} from '@/firebase/service/inspections/inspections.types'
import useCommon from '@/hooks/useCommon'
import {
	Box,
	Button,
	Flex,
	Hide,
	Input,
	Modal,
	ModalContent,
	ModalOverlay,
	Text,
} from '@chakra-ui/react'
import { Timestamp } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CiCalendarDate, CiFlag1, CiLocationOn } from 'react-icons/ci'
import { IoTimeOutline } from 'react-icons/io5'
import { MdOutlineCancel } from 'react-icons/md'
import { inspectionCategoryType } from './MyInspections'
import Link from 'next/link'

type InspectionProps = returnedInspectionData & {
	currentUserId: string
	inspectionCategory: inspectionCategoryType
}

type rescheduleInspectionModalProps = InspectionData & {
	closeRescheduleInspectionModal: () => void
	showRescheduleInspectionModal: boolean
	id: string
}

type cancelBookingModalProps = InspectionData & {
	closeCancelBookingModal: () => void
	showCancelBookingModal: boolean
	id: string
}

export default function InspectionCard({
	hasOccured,
	host_details,
	id,
	inspection_date,
	inspection_location,
	isCancelled,
	inspection_type,
	seeker_details,
	currentUserId,
	inspectionCategory,
}: InspectionProps) {
const router = useRouter()

	const [showRescheduleInspectionModal, setShowRescheduleInspectionModal] =
		useState(false)
	const [showCancelBookingModal, setShowCancelBookingModal] = useState(false)

	const openRescheduleInspectionModal = () =>
		setShowRescheduleInspectionModal(true)
	const closeRescheduleInspectionModal = () =>
		setShowRescheduleInspectionModal(false)

	const openCancelBookingModal = () => setShowCancelBookingModal(true)
	const closeCancelBookingModal = () => setShowCancelBookingModal(false)

	return (
		<>
			<CancelBookingModal
				showCancelBookingModal={showCancelBookingModal}
				closeCancelBookingModal={closeCancelBookingModal}
				hasOccured={hasOccured}
				host_details={host_details}
				id={id}
				inspection_date={inspection_date}
				inspection_location={inspection_location}
				inspection_type={inspection_type}
				isCancelled={isCancelled}
				seeker_details={seeker_details}
			/>
			<ResheduleInspectionModal
				showRescheduleInspectionModal={showRescheduleInspectionModal}
				closeRescheduleInspectionModal={closeRescheduleInspectionModal}
				hasOccured={hasOccured}
				host_details={host_details}
				id={id}
				inspection_date={inspection_date}
				inspection_location={inspection_location}
				inspection_type={inspection_type}
				isCancelled={isCancelled}
				seeker_details={seeker_details}
			/>
			<Flex
				flexDir={'column'}
				w={'100%'}
				pb={DEFAULT_PADDING}
				gap={DEFAULT_PADDING}
				borderBottom={'1px'}
				borderColor={'border_color'}
			>
				<Flex
					alignItems={'start'}
					gap={DEFAULT_PADDING}
					justifyContent={'space-between'}
				>
					<Text fontSize={{base:'sm', sm:'base', md:'lg'}} flex={1} >
						New Apartment Inspection with{' '}
						<Text as={'span'} color={'brand'}>
							{currentUserId === host_details.id
								? `${seeker_details.last_name} ${seeker_details.first_name}`
								: `${host_details.last_name} ${host_details.first_name}`}
						</Text>
					</Text>
					<Text
						display={'flex'}
						_dark={{ color: 'text_muted' }}
						fontWeight={300}
						_light={{ color: '#11171799' }}
						gap={'4px'}
						alignItems={'center'}
						justifyContent={'center'}
					>
						<Box>
							<CiFlag1 />
						</Box>
						<Hide below='sm'> 

						Flag Booking
						</Hide>
					</Text>
				</Flex>
				<Flex alignItems={'center'} flexWrap={'wrap'} justifyContent={'start'} gap={{base:'16px', md:'24px'}}>
					<Text
						display={'flex'}
						fontSize={{ base: 'xs', md: 'sm' }}
						fontWeight={300}
						_light={{ color: '#111717CC' }}
						_dark={{ color: 'text_muted' }}
						gap={'4px'}
						alignItems={'center'}
						justifyContent={'center'}
					>
						<Box>
							<CiCalendarDate />
						</Box>
						{inspection_date.toDate().toLocaleDateString('en-US', {
							weekday: 'short',
							day: 'numeric',
							year: 'numeric',
						})}
					</Text>
					<Text
						display={'flex'}
						fontSize={{ base: 'xs', md: 'sm' }}
						fontWeight={300}
						_light={{ color: '#111717CC' }}
						_dark={{ color: 'text_muted' }}
						gap={'4px'}
						alignItems={'center'}
						justifyContent={'center'}
					>
						<Box>
							<IoTimeOutline />
						</Box>
						{inspection_date
							.toDate()
							.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
					</Text>
					<Text
						display={'flex'}
						fontSize={{ base: 'xs', md: 'sm' }}
						fontWeight={300}
						_light={{ color: '#111717CC' }}
						_dark={{ color: 'text_muted' }}
						gap={'4px'}
						alignItems={'center'}
						justifyContent={'center'}
					>
						<Box>
							<CiLocationOn />
						</Box>

						{inspection_location.length > 20
							? inspection_location.substring(0, 20) + '... '
							: inspection_location}
					</Text>
					{inspectionCategory === 'upcoming' && (
						<Flex
							cursor={'pointer'}
							onClick={openRescheduleInspectionModal}
							fontWeight={300}
							color={'#FFA500'}
							textDecoration={'underline'}
						fontSize={{ base: 'sm', md: 'base' }}

						>
							Reschedule
						</Flex>
					)}
				</Flex>
				<Flex
					alignItems={'start'}
					gap={DEFAULT_PADDING}
					justifyContent={'space-between'}
					flexWrap={'wrap'}
					flexDir={'column'}
				>
										<Flex	w={'100%'}  justifyContent={'space-between'} alignItems={'center'} gap={'16px'}>
						<Text
							display={'flex'}
							_dark={{ color: 'text_muted' }}
							fontWeight={300}
							_light={{ color: '#11171799' }}
							textTransform={'capitalize'}
						fontSize={{ base: 'xs', sm:'sm', md: 'base' }}

						>
							{inspection_type} Inspection
						</Text>
					{inspectionCategory === 'upcoming' && (
						<Text
							display={'flex'}
							alignSelf={'end'}
							_dark={{ color: 'text_muted' }}
							fontWeight={300}
							_light={{ color: '#11171799' }}
							gap={'4px'}
							alignItems={'center'}
							justifyContent={'center'}
							cursor={'pointer'}
							onClick={openCancelBookingModal}
												fontSize={{ base: 'xs', sm:'sm', md: 'base' }}


						>
							<Box>
								<MdOutlineCancel color="red" />
							</Box>
							Cancel Booking
						</Text>
					)}
					</Flex>
						<Flex alignItems={'center'} gap={2}>
							<Button
								disabled={inspectionCategory !== 'upcoming'}
								rounded={'8px'}
								display={'flex'}
								alignItems={'center'}
								justifyContent={'center'}
								py={'15px'}
								px={'30px'}
								w={'100%'}
								bgColor={'brand'}
								color={'white'}								
								fontSize={{ base: 'sm', md: 'base' }}
								onClick={() => router.push(`/messages/${currentUserId === host_details.id 
								? seeker_details.id
								: host_details.id}`)}
							>
								Send Message
							</Button>
					
							<Button
								disabled={(inspectionCategory !== 'upcoming')}
					
								rounded={'8px'}
								display={'flex'}
								alignItems={'center'}
								justifyContent={'center'}
								p={'15px'}
								_dark={{ bgColor: 'black' }}
								bgColor={'#111717CC'}
								color={'white'}
								fontSize={{ base: 'sm', md: 'base' }}
							>
								Call
							</Button>
						</Flex>

				</Flex>
			</Flex>
		</>
	)
}

const CancelBookingModal = ({
	closeCancelBookingModal,
	showCancelBookingModal,
	inspection_date,
	hasOccured,
	host_details,
	inspection_location,
	inspection_type,
	isCancelled,
	seeker_details,
	id,
}: cancelBookingModalProps) => {
	const { authState } = useAuthContext()
	const { showToast } = useCommon()
	const router = useRouter()

	const [loading, setLoading] = useState<boolean>(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!authState.user?._id)
			return showToast({
				message: 'please login to reschedule an inspection',
				status: 'error',
			})

		setLoading(true)

		const data: InspectionData = {
			host_details,
			seeker_details,
			inspection_type,
			inspection_date,
			isCancelled: true,
			hasOccured,
			inspection_location,
		}

		InspectionDataSchema.parse(data)

		try {
			await InspectionServices.update({
				collection_name: DBCollectionName.inspections,
				data,
				document_id: id,
			})

			showToast({
				message: 'You have succesfully rescheduled your inspection',
				status: 'success',
			})
			router.push('/inspections')
		} catch (error) {
			console.log(error)
			showToast({
				message: 'Error rescheduling inspection',
				status: 'error',
			})
		}

		setLoading(false)
		closeCancelBookingModal()
	}

	if (loading)
		return (
			<Modal isOpen={loading} onClose={() => setLoading(false)}>
				<ModalOverlay
					bg="blackAlpha.300"
					backdropFilter="blur(10px) hue-rotate(90deg)"
				/>
				<ModalContent
					w={'100%'}
					margin={'auto'}
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
					p={{ base: '16px', md: '24px' }}
				>
					<Spinner />
				</ModalContent>
			</Modal>
		)

	return (
		<Modal
			isOpen={showCancelBookingModal}
			onClose={closeCancelBookingModal}
			size={'90vh'}
		>
			<ModalOverlay />
			<ModalContent
				w={{
					base: '90vw',
					lg: '80vw',
					xl: '70vw',
				}}
				h={{ base: '90vh', lg: '80vh', xl: '70vh' }}
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
				onSubmit={handleSubmit}
			>
				<Box
					pos={'absolute'}
					top={{ base: '16px', md: '30px' }}
					right={{ base: '16px', md: '30px' }}
					cursor={'pointer'}
					onClick={closeCancelBookingModal}
				>
					<CloseIcon />
				</Box>
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
				>
					Are you sure you want to cancel your booking?
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
						textColor={'red'}
						border={'1px'}
						borderColor={'red'}
						onClick={closeCancelBookingModal}
						fontWeight={500}
						fontSize={{ base: 'sm', md: 'base' }}
					>
						No
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
					>
						Cancel Booking
					</Button>
				</Flex>
			</ModalContent>
		</Modal>
	)
}

const ResheduleInspectionModal = ({
	closeRescheduleInspectionModal,
	showRescheduleInspectionModal,
	inspection_date,
	hasOccured,
	host_details,
	inspection_location,
	inspection_type,
	isCancelled,
	seeker_details,
	id,
}: rescheduleInspectionModalProps) => {
	const { authState } = useAuthContext()
	const { showToast } = useCommon()
	const router = useRouter()

	const [inspectionData, setInspectionData] = useState({
		inspection_date: inspection_date.toDate().toISOString().split('T')[0],
		inspection_time: inspection_date
			.toDate()
			.toTimeString()
			.split(' ')[0]
			.slice(0, 5),
	})

	const [loading, setLoading] = useState<boolean>(false)

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target

		setInspectionData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!authState.user?._id)
			return showToast({
				message: 'please login to reschedule an inspection',
				status: 'error',
			})

		setLoading(true)

		const data: InspectionData = {
			host_details,
			seeker_details,
			inspection_type,
			inspection_date: Timestamp.fromDate(
				new Date(
					`${inspectionData.inspection_date}T${inspectionData.inspection_time}:00`,
				),
			),
			isCancelled,
			hasOccured,
			inspection_location,
		}

		InspectionDataSchema.parse(data)

		try {
			await InspectionServices.update({
				collection_name: DBCollectionName.inspections,
				data,
				document_id: id,
			})

			showToast({
				message: 'You have succesfully rescheduled your inspection',
				status: 'success',
			})
			router.push('/inspections')
		} catch (error) {
			console.log(error)
			showToast({
				message: 'Error rescheduling inspection',
				status: 'error',
			})
		}

		setLoading(false)
		closeRescheduleInspectionModal()
	}

	if (loading)
		return (
			<Modal isOpen={loading} onClose={() => setLoading(false)}>
				<ModalOverlay
					bg="blackAlpha.300"
					backdropFilter="blur(10px) hue-rotate(90deg)"
				/>
				<ModalContent
					w={'100%'}
					margin={'auto'}
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
					p={{ base: '16px', md: '24px' }}
				>
					<Spinner />
				</ModalContent>
			</Modal>
		)

	return (
		<Modal
			isOpen={showRescheduleInspectionModal}
			onClose={closeRescheduleInspectionModal}
			size={'95vh'}
		>
			<ModalOverlay />
			<ModalContent
				w={{
					base: '90vw',
					lg: '80vw',
					xl: '70vw',
				}}
				h={{ base: '90vh', lg: '80vh', xl: '70vh' }}
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
				onSubmit={handleSubmit}
			>
				<Box
					pos={'absolute'}
					top={{ base: '16px', md: '30px' }}
					right={{ base: '16px', md: '30px' }}
					cursor={'pointer'}
					onClick={closeRescheduleInspectionModal}
				>
					<CloseIcon />
				</Box>
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
				>
					Reschedule Inspection
				</Text>
				<Flex justifyContent={'flex-start'} flexDir={'column'} w="full" gap={3}>
					<Text color={'text_muted'} fontSize={{ base: 'sm', sm: 'base' }}>
						Availability
					</Text>
					<Flex gap={'16px'} flexDir={{ base: 'column', sm: 'row' }}>
						<Input
							type="date"
							required
							value={inspectionData.inspection_date}
							onChange={handleChange}
							name="inspection_date"
							borderColor={'border_color'}
							_dark={{ borderColor: 'dark_light' }}
							placeholder="Select Date"
						/>
						<Input
							type="time"
							required
							value={inspectionData.inspection_time}
							onChange={handleChange}
							name="inspection_time"
							borderColor={'border_color'}
							_dark={{ borderColor: 'dark_light' }}
							placeholder="Select Time"
						/>
					</Flex>
				</Flex>

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
						onClick={closeRescheduleInspectionModal}
						fontSize={{ base: 'sm', md: 'base' }}
					>
						Cancel
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
					>
						Proceed to Payment
					</Button>
				</Flex>
			</ModalContent>
		</Modal>
	)
}
