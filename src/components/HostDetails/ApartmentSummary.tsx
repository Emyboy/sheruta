import AvailableIcon from '@/assets/svg/available-icon'
import { DEFAULT_PADDING } from '@/configs/theme'
import {
	Avatar,
	AvatarBadge,
	Badge,
	Box,
	Button,
	Flex,
	Text,
} from '@chakra-ui/react'
import { formatDistanceToNow } from 'date-fns'
import {
	BiDotsHorizontalRounded,
	BiLocationPlus,
	BiMessageRoundedDetail,
	BiPhone,
} from 'react-icons/bi'
import { CiBookmarkMinus } from 'react-icons/ci'
import { VscQuestion } from 'react-icons/vsc'
import MainTooltip from '../atoms/MainTooltip'
import { MdOutlineMailOutline } from 'react-icons/md'

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
							<Text textTransform={'capitalize'}>
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
				alignItems={'center'}
				as="address"
				color="brand"
				paddingInline={DEFAULT_PADDING}
				gap={'10px'}
			>
				<BiLocationPlus size={'24px'} />
				<Text fontSize={'xs'} fontWeight={'normal'}>
					{request.google_location_text}
				</Text>
			</Flex>
			<Flex
				flex={1}
				flexDir={'column'}
				overflowY={'scroll'}
				overflowX={'hidden'}
				p={DEFAULT_PADDING}
				gap={'16px'}
			>
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
				<Flex alignItems={'start'} justifyContent={'center'} gap={'24px'}>
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
						// boxShadow={'md'}
						boxShadow="0 2px 3px rgba(255, 255, 255, 0.5)"
					>
						<Flex flexDir={'column'}>
							<Text fontWeight={'light'} fontSize={'18px'}>
								Rent Per Room
							</Text>
							<Flex alignItems={'center'}>
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
			</Flex>
		</>
	)
}
