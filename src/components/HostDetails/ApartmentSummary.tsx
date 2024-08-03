import AvailableIcon from '@/assets/svg/available-icon'
import { DEFAULT_PADDING } from '@/configs/theme'
import {
	Avatar,
	AvatarBadge,
	Badge,
	Box,
	Button,
	Flex,
	SimpleGrid,
	Text,
} from '@chakra-ui/react'
import { formatDistanceToNow } from 'date-fns'
import {
	BiDotsHorizontalRounded,
	BiLocationPlus,
	BiMessageRoundedDetail,
	BiPhone,
} from 'react-icons/bi'
import { CiBookmarkMinus, CiCircleInfo } from 'react-icons/ci'
import { VscQuestion } from 'react-icons/vsc'
import MainTooltip from '../atoms/MainTooltip'
import { MdOutlineMailOutline } from 'react-icons/md'
import Checked from '@/assets/svg/checked'
import MessageIcon from '@/assets/svg/message'
import { FaHouseChimneyUser } from 'react-icons/fa6'
import { IoIosPeople } from 'react-icons/io'

export default function ApartmentSummary({ request }: { request: any }) {
	return (
		<>
			<Flex gap={5} alignItems={'center'} p={DEFAULT_PADDING}>
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
				<Flex
					gap={'0px'}
					flexDirection={'column'}
					justifyContent={'flex-start'}
					flex={1}
				>
					<Flex justifyContent={'space-between'} alignItems={'center'}>
						<Flex gap={2} alignItems={'center'} justifyContent={'center'}>
							<Text textTransform={'capitalize'} w={'auto'}>
								{request._user_ref.last_name} {request._user_ref.first_name}
							</Text>
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
							</Flex>
						</Flex>
						<Flex>
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
				</Flex>
			</Flex>
			<Flex
				flex={1}
				flexDir={'column'}
				overflowY={'scroll'}
				overflowX={'hidden'}
				p={DEFAULT_PADDING}
				gap={'16px'}
			>
				<Flex alignItems={'center'} as="address" color="brand" gap={'10px'}>
					<BiLocationPlus size={'24px'} />
					<Text fontSize={'xs'} fontWeight={'normal'}>
						{request.google_location_text}
					</Text>
				</Flex>
				<Text fontSize={'base'} fontWeight={'light'}>
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
							rounded="15px"
							px={'10px'}
							py={'5px'}
							textTransform={'capitalize'}
						>
							{request._service_ref.title}
						</Badge>

						<Badge
							bgColor="#FFA5001A"
							rounded="15px"
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
						p={DEFAULT_PADDING}
						bgColor={'#FFA5001A'}
					>
						<Flex alignItems={'center'} justifyContent={'start'} gap={'8px'}>
							<VscQuestion fill="#FFA500" />
							<Text fontWeight={'light'} fontSize={'base'}>
								How it works
							</Text>
						</Flex>
						<Text color={'text_muted'} fontWeight={'light'} fontSize={'small'}>
							{request._service_ref.about}
						</Text>
					</Flex>
					<Flex
						flex={1}
						flexDir={'column'}
						gap={'8px'}
						rounded={'6px'}
						p={DEFAULT_PADDING}
						bgColor={'#00BC731A'}
					>
						<Flex alignItems={'center'} justifyContent={'start'} gap={'8px'}>
							<AvailableIcon />
							<Text fontWeight={'light'} fontSize={'base'}>
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
								{request.availability_status}:{' '}
							</Text>
							User confirmed the space is still available{' '}
							{formatDistanceToNow(
								new Date(
									request.updatedAt.seconds * 1000 +
										request.updatedAt.nanoseconds / 1000000,
								),
								{ addSuffix: true },
							)}
						</Text>
					</Flex>
				</Flex>
				<Flex
					my={'32px'}
					w={'100%'}
					rounded={'lg'}
					border={'1px'}
					borderColor={'brand_darker'}
					position={'relative'}
					paddingTop={'120px'}
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
						alignItems={'center'}
						boxShadow="0 2px 3px rgba(255, 255, 255, 0.5)"
					>
						<Flex flexDir={'column'}>
							<Text fontWeight={'light'} fontSize={'18px'}>
								Rent Per Room
							</Text>
							<Flex alignItems={'center'} flexWrap={'wrap'}>
								<Text fontSize={'24px'} fontWeight={'extrabold'}>
									₦{request.budget.toLocaleString()}
								</Text>{' '}
								<Text
									fontSize={'20px'}
									fontWeight={'200'}
									textTransform={'capitalize'}
								>
									/{request.payment_type}
								</Text>
							</Flex>
						</Flex>
						<Button
							rounded={DEFAULT_PADDING}
							paddingX={'38px'}
							h={'52px'}
							paddingY={DEFAULT_PADDING}
							bgColor={'black'}
						>
							Book Inspection
						</Button>
					</Flex>
					<Flex flexDir={'column'} gap={'24px'} w={'100%'}>
						<Text fontSize={'20px'} fontWeight={'light'}>
							Price Break down
						</Text>
						<Flex justifyContent={'space-between'} alignItems={'center'}>
							<Text fontSize={'20px'} fontWeight={'normal'}>
								Duration
							</Text>
							<Text
								fontSize={'20px'}
								fontWeight={'200'}
								textTransform={'capitalize'}
							>
								{request.payment_type}
							</Text>
						</Flex>
						<Flex justifyContent={'space-between'} alignItems={'center'}>
							<Text fontSize={'20px'} fontWeight={'normal'}>
								Rent
							</Text>
							<Text fontSize={'20px'} fontWeight={'light'}>
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
						<Flex justifyContent={'space-between'} alignItems={'center'}>
							<Text fontSize={'20px'} fontWeight={'normal'}>
								Service Charge
							</Text>
							<Text fontSize={'20px'} fontWeight={'light'}>
								₦{request.service_charge.toLocaleString()}
							</Text>
						</Flex>
						<Flex justifyContent={'space-between'} alignItems={'center'}>
							<Text fontSize={'20px'} fontWeight={'light'}>
								Total
							</Text>
							<Text fontSize={'22.55px'} fontWeight={'normal'}>
								₦{(request.service_charge + request.budget).toLocaleString()}
							</Text>
						</Flex>
					</Flex>
					<Button
						rounded={'13.45px'}
						h={'60px'}
						display={'flex'}
						alignItems={'center'}
						justifyContent={'center'}
						paddingY={'16px'}
						w={'100%'}
						bgColor={'brand'}
					>
						Book Inspection
					</Button>
				</Flex>
				<Flex my={'32px'} flexDir={'column'} gap={'20px'} mt={'16px'}>
					<Text fontSize={'20px'} fontWeight={'300'}>
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
									fontSize={'18px'}
								>
									{amenity}
								</Text>
							</Flex>
						))}
					</SimpleGrid>
				</Flex>
				<Flex my={'32px'} flexDir={'column'} gap={'20px'} mt={'16px'}>
					<Text fontSize={'20px'} fontWeight={'300'}>
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
						].map((amenity: string, i: number) => (
							<Flex
								key={i}
								gap={'10px'}
								alignItems={'center'}
								justifyContent={'start'}
							>
								<Text
									textTransform={'capitalize'}
									fontWeight={'300'}
									fontSize={'18px'}
								>
									{amenity}
								</Text>
							</Flex>
						))}
					</SimpleGrid>
				</Flex>
				<Flex my={'32px'} flexDir={'column'} gap={'20px'} mt={'16px'}>
					<Text fontSize={'20px'} fontWeight={'300'}>
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
						].map((amenity: string, i: number) => (
							<Flex
								key={i}
								gap={'10px'}
								alignItems={'center'}
								justifyContent={'start'}
							>
								-
								<Text fontWeight={'300'} fontSize={'18px'}>
									{amenity}
								</Text>
							</Flex>
						))}
					</SimpleGrid>
				</Flex>
				<Flex
					my={'32px'}
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
							fontSize={'18px'}
							_dark={{ color: 'white' }}
							textColor={'#11171799'}
						>
							Choose Inspection Mode
						</Text>
					</Flex>
					<Flex
						rounded={DEFAULT_PADDING}
						p={'30px'}
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
							<CiCircleInfo fill="#FFA500" fontSize={'24px'} />
							<Text
								fontWeight={'400'}
								fontSize={'20px'}
								textColor={'#111717CC'}
								_dark={{ color: 'text_muted' }}
							>
								Virtual/physical Inspection is Available
							</Text>
						</Flex>
						<Button
							rounded={DEFAULT_PADDING}
							paddingX={'150px'}
							h={'59px'}
							paddingY={'16px'}
							bgColor={'#FFA500'}
							textColor={'white'}
							fontWeight={'20px'}
							marginX={'auto'}
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
					py={'20px'}
					px={DEFAULT_PADDING}
					gap={'25px'}
					border={'1px'}
					rounded={'16px'}
				>
					<Flex
						flex={1}
						alignItems={'center'}
						justifyContent={'center'}
						gap={'32px'}
					>
						<Avatar
							src={request._user_ref.avatar_url}
							size={{
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
								fontSize={'18px'}
								_dark={{ color: 'white' }}
								_light={{ color: '#111717CC' }}
								textTransform={'capitalize'}
							>
								{request._user_ref.last_name} {request._user_ref.first_name}
							</Text>
							<Text fontWeight={'300'} fontSize={'base'} color={'brand'}>
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
							fontSize={'sm'}
							_dark={{ color: 'text_muted' }}
							_light={{ color: '#111717CC' }}
						>
							Last Active:
						</Text>
						<Text fontWeight={'300'} fontSize={'sm'} color={'#FFA500'}>
							5 hours ago
						</Text>
					</Flex>
				</Flex>
				<SimpleGrid columns={2} spacingY="16px">
					<Flex gap={'10px'} alignItems={'center'} justifyContent={'start'}>
						<Checked />

						<Text
							textTransform={'capitalize'}
							fontWeight={'300'}
							fontSize={'20px'}
						>
							Background Check
						</Text>
					</Flex>
					<Flex gap={'10px'} alignItems={'center'} justifyContent={'start'}>
						<Checked />

						<Text
							textTransform={'capitalize'}
							fontWeight={'300'}
							fontSize={'20px'}
						>
							Identity Verification
						</Text>
					</Flex>
					<Flex gap={'10px'} alignItems={'center'} justifyContent={'start'}>
						<Checked />

						<Text
							textTransform={'capitalize'}
							fontWeight={'300'}
							fontSize={'20px'}
						>
							House Verification
						</Text>
					</Flex>
					<Flex gap={'10px'} alignItems={'center'} justifyContent={'start'}>
						<MessageIcon />

						<Text
							textTransform={'capitalize'}
							fontWeight={'300'}
							fontSize={'20px'}
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
							fontSize={'18px'}
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
							fontSize={'18px'}
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
