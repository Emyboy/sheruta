import ApartmentDetails from '@/components/HostDetails/ApartmentDetails'
import MediaCarousel from '@/components/HostDetails/MediaCarousel'
import { DEFAULT_PADDING } from '@/configs/theme'
import { FlatShareRequest } from '@/firebase/service/request/request.types'
import axiosInstance from '@/utils/custom-axios'
import { Box, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FaAngleLeft } from 'react-icons/fa'

const size = {
	base: '98vw',
	xl: '1300px',
}

export default async function page({
	params: { request_id },
}: {
	params: { request_id: string }
}) {
	const {
		data: { data: requestData },
	}: { data: { data: FlatShareRequest } } = await axiosInstance.get(
		`/flat-share-requests/${request_id}`,
	)

	if (!requestData) redirect('/')

	return (
		<Flex
			justifyContent={'start'}
			alignItems={'center'}
			flexDir={'column'}
			minH={'100vh'}
			pos={'relative'}
			maxW={size}
			minW={size}
			mx={'auto'}
			gap={DEFAULT_PADDING}
			_dark={{ bgColor: 'dark' }}
		>
			<Flex justifyContent={'flex-start'} w={size}>
				<Link href={'/'}>
					<Flex
						flexDirection={'row'}
						alignItems={'center'}
						cursor={'pointer'}
						gap={2}
						mt={{ base: '16px', md: '24px' }}
						pl={'15px'}
					>
						<Box>
							<FaAngleLeft size={'24px'} />
						</Box>
						<Text
							as={'h4'}
							fontSize={{ base: 'base', md: '24px' }}
							fontWeight={'medium'}
						>
							Go Home
						</Text>
					</Flex>
				</Link>
			</Flex>
			<Flex
				minH={'90vh'}
				maxH={'90vh'}
				mx={'auto'}
				overflow={{ lg: 'hidden' }}
				flexDir={{ base: 'column', lg: 'row' }}
			>
				<Flex
					minW={{ base: '100%', lg: '50%' }}
					maxW={{ base: '100%', lg: '50%' }}
					flexFlow={'column'}
				>
					<MediaCarousel
						video={requestData.video_url}
						images={requestData.image_urls}
					/>
				</Flex>

				<Flex
					flex={1}
					minW={{ base: '100%', lg: '50%' }}
					maxW={{ base: '100%', lg: '50%' }}
					flexDir={'column'}
				>
					<ApartmentDetails
						request={requestData}
						discussions={undefined}
						hostNinData={undefined}
					/>
				</Flex>
			</Flex>
		</Flex>
	)
}
