'use client'

import AvailableIcon from '@/assets/svg/available-icon'
import BookInspectionBadge from '@/assets/svg/book-inspection-badge'
import Checked from '@/assets/svg/checked'
import CloseIcon from '@/assets/svg/close-icon-dark'
import MessageIcon from '@/assets/svg/message'
import PhysicalInspectionIcon from '@/assets/svg/physical-inspection-icon'
import VirtualInspectionIcon from '@/assets/svg/virtual-inspection-icon'
import { DEFAULT_PADDING } from '@/configs/theme'
import {
	Avatar,
	AvatarBadge,
	Badge,
	Box,
	Button,
	Flex,
	Input,
	Select,
	SimpleGrid,
	Text,
} from '@chakra-ui/react'
import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'
import {
	BiDotsHorizontalRounded,
	BiLocationPlus,
	BiMessageRoundedDetail,
	BiPhone,
} from 'react-icons/bi'
import { CiBookmarkMinus, CiCircleInfo } from 'react-icons/ci'
import { FaHouseChimneyUser } from 'react-icons/fa6'
import { IoIosCheckmarkCircleOutline, IoIosPeople } from 'react-icons/io'
import { MdOutlineMailOutline } from 'react-icons/md'
import { VscQuestion } from 'react-icons/vsc'
import MainTooltip from '../atoms/MainTooltip'

export default function ApartmentSummary({ request }: { request: any }) {
	const [showBookInspectionModal, setShowBookInspectionModal] =
		useState<boolean>(false)

	const openModal = () => setShowBookInspectionModal(true)
	const closeModal = () => setShowBookInspectionModal(false)

	if (showBookInspectionModal)
		return <BookInspectionModal closeModal={closeModal} />

	return (
		<>
			<Flex
				gap={{ base: '8px', sm: 5 }}
				alignItems={{ base: 'start', sm: 'center' }}
				flexDir={{ base: 'column', sm: 'row' }}
				p={DEFAULT_PADDING}
				bgColor={'dark'}
			>
				<Flex alignItems={'center'} gap={{ base: '8px', md: '16px' }}>
					<Avatar
						src={request._user_ref.avatar_url}
						size={{
							md: 'md',
							base: 'md',
						}}
					>
						<AvatarBadge
							boxSize="10px"
							border={'0px'}
							bottom={'6px'}
							bg="green.500"
						/>
					</Avatar>
					<Text
						textTransform={'capitalize'}
						fontSize={{ base: 'sm', md: 'base' }}
						w={'auto'}
					>
						{request._user_ref.last_name} {request._user_ref.first_name}
					</Text>
				</Flex>
				<Flex>
					<MainTooltip label="Call me" placement="top">
						<Button
							px={0}
							bg="none"
							color="text_muted"
							display={'flex'}
							fontWeight={'light'}
							_hover={{
								color: 'brand',
								bg: 'none',
								_dark: {
									color: 'brand',
								},
							}}
							_dark={{
								color: 'dark_lighter',
							}}
							fontSize={{
								md: '2xl',
								base: 'xl',
							}}
						>
							<BiPhone />
						</Button>
					</MainTooltip>
					<MainTooltip label="Message me" placement="top">
						<Button
							px={0}
							bg="none"
							color="text_muted"
							display={'flex'}
							fontWeight={'light'}
							_hover={{
								color: 'brand',
								bg: 'none',
								_dark: {
									color: 'brand',
								},
							}}
							_dark={{
								color: 'dark_lighter',
							}}
							fontSize={{
								md: '2xl',
								base: 'xl',
							}}
							ml={'-8px'}
						>
							<MdOutlineMailOutline />
						</Button>
					</MainTooltip>
					<MainTooltip label="Show more" placement="top">
						<Button
							px={0}
							bg="none"
							color="text_muted"
							display={'flex'}
							fontWeight={'light'}
							_hover={{
								color: 'brand',
								bg: 'none',
								_dark: {
									color: 'brand',
								},
							}}
							_dark={{
								color: 'dark_lighter',
							}}
							fontSize={{
								md: 'xl',
								base: 'lg',
							}}
						>
							<BiDotsHorizontalRounded />
						</Button>
					</MainTooltip>
					<MainTooltip label="Save for later" placement="top">
						<Button
							px={0}
							bg="none"
							color="text_muted"
							display={'flex'}
							fontWeight={'light'}
							_hover={{
								color: 'brand',
								bg: 'none',
								_dark: {
									color: 'brand',
								},
							}}
							_dark={{
								color: 'dark_lighter',
							}}
							fontSize={{
								md: 'xl',
								base: 'lg',
							}}
							ml={'-8px'}
						>
							<CiBookmarkMinus />
						</Button>
					</MainTooltip>
				</Flex>
			</Flex>

			<Flex
				flex={1}
				flexDir={'column'}
				overflowY={'scroll'}
				overflowX={'hidden'}
				p={DEFAULT_PADDING}
				gap={'16px'}
				bgColor={'dark'}
				mt={'-16px'}
			>
				<Text color="text_muted" fontSize={'sm'}>
					Posted{' '}
					{formatDistanceToNow(
						new Date(
							request.updatedAt.seconds * 1000 +
								request.updatedAt.nanoseconds / 1000000,
						),
						{ addSuffix: true },
					)}
				</Text>
				<Flex alignItems={'center'} as="address" color="brand" gap={'10px'}>
					<BiLocationPlus size={'24px'} />
					<Text fontSize={'xs'} fontWeight={'normal'}>
						{request.google_location_text}
					</Text>
				</Flex>
				<Text fontSize={{ base: 'sm', sm: 'base' }} fontWeight={'light'}>
					{request.description}
				</Text>
				<Flex gap={'10px'}>
					<BiMessageRoundedDetail />
					<Text fontSize={'xs'} fontWeight={'light'}>
						2
					</Text>
				</Flex>
				<Box
					h={'2px'}
					borderRadius={'4px'}
					w={'100%'}
					bgColor={'brand_darker'}
				/>
				<Flex justifyContent={'space-between'}>
					<Flex gap={DEFAULT_PADDING}>
						<Badge
							bgColor="#E4FAA866"
							rounded={DEFAULT_PADDING}
							px={'10px'}
							py={'5px'}
							textTransform={'capitalize'}
						>
							{request._service_ref.title}
						</Badge>

						<Badge
							bgColor="#FFA5001A"
							rounded={DEFAULT_PADDING}
							px={'10px'}
							py={'5px'}
							textTransform={'capitalize'}
						>
							{request._category_ref.title}
						</Badge>
					</Flex>

					<Badge
						border="1px"
						borderColor={'border-color'}
						rounded="md"
						px={'15px'}
						py={'5px'}
						_dark={{
							borderColor: 'dark_light',
							color: 'dark_lighter',
						}}
						textTransform={'capitalize'}
					>
						{request._property_type_ref.title}
					</Badge>
				</Flex>
				<Flex
					alignItems={'start'}
					flexDir={{ base: 'column', md: 'row' }}
					justifyContent={'center'}
					gap={'24px'}
				>
					<Flex
						flex={1}
						flexDir={'column'}
						gap={'8px'}
						rounded={'6px'}
						p={{ base: '12px', sm: DEFAULT_PADDING }}
						bgColor={'#FFA5001A'}
					>
						<Flex alignItems={'center'} justifyContent={'start'} gap={'8px'}>
							<VscQuestion fill="#FFA500" />
							<Text fontWeight={'light'} fontSize={{ base: 'sm', sm: 'base' }}>
								How it works
							</Text>
						</Flex>
						<Text color={'text_muted'} fontWeight={'light'} fontSize={'sm'}>
							{request._service_ref.about}
						</Text>
					</Flex>
					<AvailabilityStatusCard
						status={request.availability_status}
						updatedAt={request.updatedAt}
					/>
				</Flex>
				<Flex
					my={{ base: '24px', sm: '32px' }}
					w={'100%'}
					rounded={'lg'}
					border={'1px'}
					borderColor={'brand_darker'}
					position={'relative'}
					paddingTop={{ base: '140px', md: '120px' }}
					paddingBottom={DEFAULT_PADDING}
					paddingX={'20px'}
					gap={'16px'}
					flexDir={'column'}
				>
					<Flex
						borderBottom={'1px'}
						borderX={'1px'}
						borderColor={'brand_darker'}
						pos={'absolute'}
						padding={DEFAULT_PADDING}
						top={DEFAULT_PADDING}
						right={'-17px'}
						left={'-17px'}
						paddingY={DEFAULT_PADDING}
						paddingX={'20px'}
						bg={'dark'}
						justifyContent={'space-between'}
						flexDir={{ base: 'column', sm: 'row' }}
						gap={{ base: '24px', sm: '16px' }}
						alignItems={{ base: 'start', sm: 'center' }}
						boxShadow="0 2px 3px rgba(255, 255, 255, 0.5)"
					>
						<Flex flexDir={'column'}>
							<Text
								fontWeight={'light'}
								fontSize={{ base: '16px', md: '18px' }}
							>
								Rent Per Room
							</Text>
							<Flex alignItems={'center'} flexWrap={'wrap'}>
								<Text
									fontSize={{ base: '18px', md: '24px' }}
									fontWeight={'extrabold'}
								>
									₦{request.budget.toLocaleString()}
								</Text>{' '}
								<Text
									fontSize={{ base: 'lg', md: 'xl' }}
									fontWeight={'200'}
									textTransform={'capitalize'}
								>
									/{request.payment_type}
								</Text>
							</Flex>
						</Flex>
						<Button
							rounded={DEFAULT_PADDING}
							paddingX={{ base: '28px', md: '38px' }}
							h={{ base: '48px', md: '52px' }}
							paddingY={{ base: '12px', md: DEFAULT_PADDING }}
							bgColor={'black'}
							onClick={openModal}
							fontSize={{ base: 'sm', md: 'base' }}
						>
							Book Inspection
						</Button>
					</Flex>
					<Flex flexDir={'column'} gap={'24px'} w={'100%'}>
						<Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight={'light'}>
							Price Break down
						</Text>
						<Flex
							justifyContent={'space-between'}
							flexDir={{ base: 'column', sm: 'row' }}
							alignItems={{ base: 'start', sm: 'center' }}
						>
							<Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight={'normal'}>
								Duration
							</Text>
							<Text
								fontSize={{ base: 'lg', md: 'xl' }}
								fontWeight={'200'}
								textTransform={'capitalize'}
							>
								{request.payment_type}
							</Text>
						</Flex>
						<Flex
							justifyContent={'space-between'}
							flexDir={{ base: 'column', sm: 'row' }}
							alignItems={{ base: 'start', sm: 'center' }}
						>
							<Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight={'normal'}>
								Rent
							</Text>
							<Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight={'light'}>
								₦{request.budget.toLocaleString()}
							</Text>
						</Flex>
					</Flex>
					<Box
						h={'2px'}
						borderRadius={'4px'}
						w={'100%'}
						bgColor={'brand_darker'}
					/>
					<Flex flexDir={'column'} gap={'32px'} w={'100%'}>
						<Flex
							justifyContent={'space-between'}
							flexDir={{ base: 'column', sm: 'row' }}
							alignItems={{ base: 'start', sm: 'center' }}
						>
							<Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight={'normal'}>
								Service Charge
							</Text>
							<Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight={'light'}>
								₦{request.service_charge.toLocaleString()}
							</Text>
						</Flex>
						<Flex justifyContent={'space-between'} alignItems={'center'}>
							<Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight={'light'}>
								Total
							</Text>
							<Text
								fontSize={{ base: 'lg', md: '22.55px' }}
								fontWeight={'normal'}
							>
								₦{(request.service_charge + request.budget).toLocaleString()}
							</Text>
						</Flex>
					</Flex>
					<Button
						rounded={'13.45px'}
						h={{ base: '48px', md: '60px' }}
						display={'flex'}
						alignItems={'center'}
						justifyContent={'center'}
						paddingY={'16px'}
						w={'100%'}
						bgColor={'brand'}
						onClick={openModal}
						fontSize={{ base: 'sm', md: 'base' }}
					>
						Book Inspection
					</Button>
				</Flex>
				<Flex
					my={{ base: '24px', sm: '32px' }}
					flexDir={'column'}
					gap={'20px'}
					mt={'16px'}
				>
					<Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight={'300'}>
						Amenities
					</Text>
					<Box
						h={'2px'}
						borderRadius={'4px'}
						w={'100%'}
						bgColor={'brand_darker'}
					/>
					<SimpleGrid columns={[2, null, 3]} spacingY="16px">
						{request.amenities.map((amenity: string, i: number) => (
							<Flex
								key={i}
								gap={'10px'}
								alignItems={'center'}
								justifyContent={'start'}
							>
								<Text
									textTransform={'capitalize'}
									fontWeight={'300'}
									fontSize={{ base: 'base', md: 'lg' }}
								>
									{amenity}
								</Text>
							</Flex>
						))}
					</SimpleGrid>
				</Flex>
				<Flex
					my={{ base: '24px', sm: '32px' }}
					flexDir={'column'}
					gap={'20px'}
					mt={'16px'}
				>
					<Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight={'300'}>
						Facilities
					</Text>
					<Box
						h={'2px'}
						borderRadius={'4px'}
						w={'100%'}
						bgColor={'brand_darker'}
					/>
					<SimpleGrid columns={[2, null, 3]} spacingY="16px">
						{[
							'Power',
							'Security',
							'Cleaning',
							'Water Supply',
							'Waste',
							'Estate Levy',
						].map((facility, i) => (
							<Flex
								key={i}
								gap={'10px'}
								alignItems={'center'}
								justifyContent={'start'}
							>
								<Text
									textTransform={'capitalize'}
									fontWeight={'300'}
									fontSize={{ base: 'base', md: 'lg' }}
								>
									{facility}
								</Text>
							</Flex>
						))}
					</SimpleGrid>
				</Flex>
				<Flex
					my={{ base: '24px', sm: '32px' }}
					flexDir={'column'}
					gap={'20px'}
					mt={'16px'}
				>
					<Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight={'300'}>
						House Rules
					</Text>
					<Box
						h={'2px'}
						borderRadius={'4px'}
						w={'100%'}
						bgColor={'brand_darker'}
					/>
					<SimpleGrid columns={1} spacingY="16px">
						{[
							'No Pets allowed in or outside your apartment',
							'No loud parties or overnight parties',
							'No smoking in the premises',
						].map((rule, i) => (
							<Flex
								key={i}
								gap={'10px'}
								alignItems={'center'}
								justifyContent={'start'}
							>
								-
								<Text fontWeight={'300'} fontSize={{ base: 'base', md: 'lg' }}>
									{rule}
								</Text>
							</Flex>
						))}
					</SimpleGrid>
				</Flex>
				<Flex
					my={{ base: '24px', sm: '32px' }}
					flexDir={'column'}
					gap={DEFAULT_PADDING}
					p={DEFAULT_PADDING}
					rounded={'16px'}
					border={'1px'}
					borderColor={'brand_dark'}
				>
					<Flex alignItems={'center'} p={DEFAULT_PADDING}>
						<Text
							fontWeight={'300'}
							fontSize={{ base: 'base', md: 'lg' }}
							_dark={{ color: 'white' }}
							textColor={'#11171799'}
						>
							Choose Inspection Mode
						</Text>
					</Flex>
					<Flex
						rounded={DEFAULT_PADDING}
						p={{ base: DEFAULT_PADDING, md: '30px' }}
						bgColor={'#FFA5001A'}
						flexDir={'column'}
						gap={'32px'}
						mb={'16px'}
					>
						<Flex
							gap={'8px'}
							alignSelf={'start'}
							alignItems={'center'}
							justifyContent={'center'}
						>
							<CiCircleInfo fill="#FFA500" size={'24px'} />
							<Text
								fontWeight={'400'}
								fontSize={{ base: 'base', md: 'xl' }}
								textColor={'#111717CC'}
								_dark={{ color: 'text_muted' }}
							>
								Virtual/physical Inspection is Available
							</Text>
						</Flex>
						<Button
							rounded={DEFAULT_PADDING}
							paddingX={{ base: '45px', sm: '100px', md: '150px' }}
							h={{ base: '48px', md: '60px' }}
							paddingY={'16px'}
							bgColor={'#FFA500'}
							textColor={'white'}
							fontWeight={'20px'}
							marginX={'auto'}
							onClick={openModal}
							fontSize={{ base: 'sm', md: 'base' }}
						>
							Book Inspection
						</Button>
					</Flex>
				</Flex>
				<Flex
					my={'16px'}
					_light={{
						bgColor: 'white',
						borderColor: '#11171708',
					}}
					_dark={{
						bgColor: 'dark',
						borderColor: 'brand_darker',
					}}
					py={{ base: '16px', md: '20px' }}
					px={{ base: '12px', md: DEFAULT_PADDING }}
					gap={{ base: '16px', md: '25px' }}
					border={'1px'}
					rounded={'16px'}
					flexDir={{ base: 'column', sm: 'row' }}
				>
					<Flex
						flex={1}
						alignItems={{ base: 'start', md: 'center' }}
						justifyContent={'center'}
						flexDir={{ base: 'column', sm: 'row' }}
						gap={{ base: '16px', md: '32px' }}
					>
						<Avatar
							src={request._user_ref.avatar_url}
							w={{
								md: '100px',
								base: '60px',
							}}
							h={{
								md: '100px',
								base: '60px',
							}}
						>
							{/* <AvatarBadge
								boxSize="10px"
								border={'0px'}
								bottom={'6px'}
								bg="green.500"
							/> */}
						</Avatar>
						<Flex
							flexDir={'column'}
							alignItems={'start'}
							justifyContent={'center'}
						>
							<Text
								fontWeight={'400'}
								fontSize={{ base: '16px', md: '18px' }}
								_dark={{ color: 'white' }}
								_light={{ color: '#111717CC' }}
								textTransform={'capitalize'}
							>
								{request._user_ref.last_name} {request._user_ref.first_name}
							</Text>
							<Text
								fontWeight={'300'}
								fontSize={{ base: 'xs', sm: 'sm', md: 'base' }}
								color={'brand'}
							>
								Lagos Nigeria
							</Text>
						</Flex>
					</Flex>
					<Flex
						flex={1}
						flexDir={'column'}
						alignItems={'start'}
						justifyContent={'center'}
					>
						<Text
							fontWeight={'300'}
							fontSize={{ base: 'xs', md: 'sm' }}
							_dark={{ color: 'text_muted' }}
							_light={{ color: '#111717CC' }}
						>
							Last Active:
						</Text>
						<Text
							fontWeight={'300'}
							fontSize={{ base: 'xs', md: 'sm' }}
							color={'#FFA500'}
						>
							5 hours ago
						</Text>
					</Flex>
				</Flex>
				<SimpleGrid columns={{ base: 1, sm: 2 }} spacingY="16px">
					<Flex gap={'10px'} alignItems={'center'} justifyContent={'start'}>
						<Checked />

						<Text
							textTransform={'capitalize'}
							fontWeight={'300'}
							fontSize={{ base: 'base', sm: 'lg', md: 'xl' }}
						>
							Background Check
						</Text>
					</Flex>
					<Flex gap={'10px'} alignItems={'center'} justifyContent={'start'}>
						<Checked />

						<Text
							textTransform={'capitalize'}
							fontWeight={'300'}
							fontSize={{ base: 'base', sm: 'lg', md: 'xl' }}
						>
							Identity Verification
						</Text>
					</Flex>
					<Flex gap={'10px'} alignItems={'center'} justifyContent={'start'}>
						<Checked />

						<Text
							textTransform={'capitalize'}
							fontWeight={'300'}
							fontSize={{ base: 'base', sm: 'lg', md: 'xl' }}
						>
							House Verification
						</Text>
					</Flex>
					<Flex gap={'10px'} alignItems={'center'} justifyContent={'start'}>
						<MessageIcon />

						<Text
							textTransform={'capitalize'}
							fontWeight={'300'}
							fontSize={{ base: 'base', sm: 'lg', md: 'xl' }}
						>
							Response Rate: 98%
						</Text>
					</Flex>
				</SimpleGrid>
				<SimpleGrid mt={'16px'} mb={'48px'} columns={1} spacingY="16px">
					<Flex gap={'10px'} alignItems={'center'} justifyContent={'start'}>
						<IoIosPeople color="00BC73" size={'24px'} />

						<Text
							textTransform={'capitalize'}
							fontWeight={'300'}
							fontSize={{ base: 'base', md: 'lg' }}
							color={'text_muted'}
						>
							Member Since 2020
						</Text>
					</Flex>
					<Flex gap={'10px'} alignItems={'center'} justifyContent={'start'}>
						<FaHouseChimneyUser color="00BC73" size={'24px'} />

						<Text
							textTransform={'capitalize'}
							fontWeight={'300'}
							fontSize={{ base: 'base', md: 'lg' }}
							color={'text_muted'}
						>
							2 Listing
						</Text>
					</Flex>
				</SimpleGrid>
			</Flex>
		</>
	)
}

const BookInspectionModal = ({ closeModal }: { closeModal: () => void }) => {
	return (
		<Flex
			pos={'fixed'}
			bg={'transparent'}
			zIndex={1000}
			top={0}
			right={0}
			left={0}
			bottom={0}
			h={'100vh'}
			w={'100vw'}
			alignItems={'center'}
			justifyContent={'center'}
		>
			<Flex
				w={{
					base: '90vw',
					lg: '80vw',
					xl: '70vw',
				}}
				h={'auto'}
				maxH={'90%'}
				overflowY={'auto'}
				flexDir={'column'}
				alignItems={'center'}
				justifyContent={'center'}
				position={'relative'}
				rounded={'16px'}
				_dark={{ bgColor: 'black' }}
				_light={{ bgColor: 'white' }}
				py={{ base: '16px', md: '24px' }}
				px={{ base: '16px', sm: '24px', md: '32px' }}
				gap={{ base: '24px', md: '32px' }}
			>
				<Box
					pos={'absolute'}
					top={{ base: '16px', md: '30px' }}
					right={{ base: '16px', md: '30px' }}
					cursor={'pointer'}
					onClick={closeModal}
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
					Book Inspection
				</Text>
				<Flex
					alignItems={'center'}
					justifyContent={'start'}
					rounded={'8px'}
					gap={{ base: '16px', md: '24px' }}
					px={{ base: '18px', md: '26px' }}
					py={{ base: '14px', md: '18px' }}
					flex={1}
					bgColor={'#FFA5001A'}
				>
					<Box display={{ base: 'none', md: 'block' }}>
						<CiCircleInfo size={'30px'} fill="#FFA500" />
					</Box>
					<Box display={{ base: 'block', md: 'none' }}>
						<CiCircleInfo size={'24px'} fill="#FFA500" />
					</Box>
					<Text
						fontWeight={'light'}
						fontSize={{ base: '14px', md: '16px' }}
						_light={{ color: '#111717CC' }}
					>
						Our Inspection Service Provides you with 100% money back Guarantee
					</Text>
				</Flex>
				<Flex
					gap={DEFAULT_PADDING}
					w="full"
					flexDir={{ base: 'column', md: 'row' }}
				>
					<Flex
						justifyContent={'flex-start'}
						flexDir={'column'}
						w="full"
						gap={3}
					>
						<Text
							_dark={{ color: 'text_muted' }}
							fontSize={{ base: 'sm', sm: 'base' }}
						>
							Choose Inpsection Mode
						</Text>
						<Select
							required
							name="inspectionMode"
							borderColor={'border_color'}
							_dark={{ borderColor: 'dark_light' }}
							placeholder="Virual/Physical"
							size="md"
							color={'border_color'}
						>
							<option value={'virtual'}>Virtual Inspection</option>
							<option value={'physical'}>Physical Inspection</option>
						</Select>
					</Flex>

					<Flex
						justifyContent={'flex-start'}
						flexDir={'column'}
						w="full"
						gap={3}
					>
						<Text color={'text_muted'} fontSize={{ base: 'sm', sm: 'base' }}>
							Availability
						</Text>
						<Flex gap={'16px'} flexDir={{ base: 'column', sm: 'row' }}>
							<Input
								type="date"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Select Date"
							/>
							<Input
								type="time"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Select Time"
							/>
						</Flex>
					</Flex>
				</Flex>
				<Flex
					rounded={'8px'}
					py={{ base: '16px', lg: '24px' }}
					px={{ base: '16px', sm: '20px', lg: '32px' }}
					bgColor={'#E4FAA81A'}
					gap={'32px'}
					flexDir={{ base: 'column', md: 'row' }}
					w={'100%'}
				>
					<Flex flexDir={'column'} gap={{ base: '16px', md: '24px' }}>
						<Flex gap={'16px'} alignItems={'center'}>
							<VirtualInspectionIcon />
							<Text
								_light={{ color: '#111717CC' }}
								fontSize={{ base: '12px', md: '14px' }}
								color={'text_muted'}
								fontWeight={'300'}
							>
								Virtual Inspection Cost{' '}
								<Text as={'span'} fontWeight={'400'}>
									N5000
								</Text>
							</Text>
						</Flex>
						<Text
							_light={{ color: '#111717CC' }}
							fontSize={{ base: '14px', md: '16px' }}
							color={'text_muted'}
							fontWeight={'300'}
							textDecoration={'underline'}
						>
							Why Virtual Inspection?
						</Text>
						<SimpleGrid columns={1} spacingY="16px">
							{[
								'Cost Effective',
								'Convinience and Remote Access',
								'Visual Documentation of Apartment',
								'Time Stamp and Record Keeping',
							].map((reason, i) => (
								<Flex
									key={i}
									gap={{ base: '6px', md: '10px' }}
									alignItems={'center'}
									justifyContent={'start'}
								>
									<IoIosCheckmarkCircleOutline
										height={'24px'}
										width={'24px'}
										color="#00BC73"
									/>
									<Text
										_light={{ color: '#111717CC' }}
										fontSize={{ base: '14px', md: '16px' }}
										color={'text_muted'}
										fontWeight={'300'}
									>
										{reason}
									</Text>
								</Flex>
							))}
						</SimpleGrid>
					</Flex>
					<Box
						w={'2px'}
						h={'100%'}
						_light={{ bgColor: '#11171708' }}
						_dark={{ bgColor: 'black' }}
						rounded={'4px'}
						display={{ base: 'none', md: 'block' }}
					/>
					<Flex flexDir={'column'} gap={{ base: '16px', md: '24px' }}>
						<Flex gap={'16px'} alignItems={'center'}>
							<PhysicalInspectionIcon />
							<Text
								_light={{ color: '#111717CC' }}
								fontSize={{ base: '12px', md: '14px' }}
								color={'text_muted'}
								fontWeight={'300'}
							>
								Physical Inspection Cost{' '}
								<Text as={'span'} fontWeight={'400'}>
									N10000
								</Text>
							</Text>
						</Flex>
						<Text
							_light={{ color: '#111717CC' }}
							fontSize={{ base: '14px', md: '16px' }}
							color={'text_muted'}
							fontWeight={'300'}
							textDecoration={'underline'}
						>
							Why Physical Inspection?
						</Text>
						<SimpleGrid columns={1} spacingY="16px">
							{[
								"Seeker's Satisfaction",
								'Identifying Rent Violations',
								'Physical Documentation of Apartment',
								'Proper Identification of Environment',
							].map((reason, i) => (
								<Flex
									key={i}
									gap={{ base: '6px', md: '10px' }}
									alignItems={'center'}
									justifyContent={'start'}
								>
									<IoIosCheckmarkCircleOutline
										height={'24px'}
										width={'24px'}
										color="#00BC73"
									/>
									<Text
										_light={{ color: '#111717CC' }}
										fontSize={{ base: '14px', md: '16px' }}
										color={'text_muted'}
										fontWeight={'300'}
									>
										{reason}
									</Text>
								</Flex>
							))}
						</SimpleGrid>
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
						onClick={closeModal}
						fontSize={{ base: 'sm', md: 'base' }}
					>
						Cancel
					</Button>
					<Button
						rounded={DEFAULT_PADDING}
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
			</Flex>
		</Flex>
	)
}

const AvailabilityStatusCard = ({
	status,
	updatedAt,
}: {
	status: 'available' | 'unavailable' | 'reserved' | null
	updatedAt: { seconds: number; nanoseconds: number }
}) => {
	if (status === 'available')
		return (
			<Flex
				flex={1}
				flexDir={'column'}
				gap={'8px'}
				rounded={'6px'}
				p={{ base: '12px', sm: DEFAULT_PADDING }}
				bgColor={'#00BC731A'}
			>
				<Flex alignItems={'center'} justifyContent={'start'} gap={'8px'}>
					<AvailableIcon fill="#00bc73" />
					<Text fontWeight={'light'} fontSize={{ base: 'sm', sm: 'base' }}>
						Availability status
					</Text>
				</Flex>
				<Text color={'text_muted'} fontWeight={'light'} fontSize={'xs'}>
					<Text
						as="span"
						fontWeight={'bold'}
						color={'brand'}
						textTransform={'capitalize'}
					>
						{status}:{' '}
					</Text>
					User confirmed the space is still available{' '}
					{formatDistanceToNow(
						new Date(
							updatedAt.seconds * 1000 + updatedAt.nanoseconds / 1000000,
						),
						{ addSuffix: true },
					)}
				</Text>
			</Flex>
		)
	if (status === 'unavailable')
		return (
			<Flex
				flex={1}
				flexDir={'column'}
				gap={'8px'}
				rounded={'6px'}
				p={{ base: '12px', sm: DEFAULT_PADDING }}
				bgColor={'#FF49491A'}
			>
				<Flex alignItems={'center'} justifyContent={'start'} gap={'8px'}>
					<AvailableIcon fill="#FF4949" />
					<Text fontWeight={'light'} fontSize={{ base: 'sm', sm: 'base' }}>
						Availability status
					</Text>
				</Flex>
				<Text color={'text_muted'} fontWeight={'light'} fontSize={'xs'}>
					<Text
						as="span"
						fontWeight={'bold'}
						color={'#FF4949'}
						textTransform={'capitalize'}
					>
						{status}:{' '}
					</Text>
					This space is has been confirmed taken by the host{' '}
					{formatDistanceToNow(
						new Date(
							updatedAt.seconds * 1000 + updatedAt.nanoseconds / 1000000,
						),
						{ addSuffix: true },
					)}
				</Text>
			</Flex>
		)
	if (status === 'reserved')
		return (
			<Flex
				flex={1}
				flexDir={'column'}
				gap={'8px'}
				rounded={'6px'}
				p={{ base: '12px', sm: DEFAULT_PADDING }}
				bgColor={'#FFA5001A'}
			>
				<Flex alignItems={'center'} justifyContent={'start'} gap={'8px'}>
					<AvailableIcon fill="#FFA500" />
					<Text fontWeight={'light'} fontSize={{ base: 'sm', sm: 'base' }}>
						Availability status
					</Text>
				</Flex>
				<Text color={'text_muted'} fontWeight={'light'} fontSize={'xs'}>
					<Text
						as="span"
						fontWeight={'bold'}
						color={'#FFA500'}
						textTransform={'capitalize'}
					>
						{status}:{' '}
					</Text>
					This space has been reserved for a premium community member.
				</Text>
			</Flex>
		)
	return null
}