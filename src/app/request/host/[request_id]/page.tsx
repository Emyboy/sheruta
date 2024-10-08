import ApartmentDetails from '@/components/HostDetails/ApartmentDetails'
import MediaCarousel from '@/components/HostDetails/MediaCarousel'
import { DEFAULT_PADDING } from '@/configs/theme'
import DiscussionService from '@/firebase/service/discussions/discussions.firebase'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import { Box, Flex, Text } from '@chakra-ui/react'
import { DocumentData } from 'firebase/firestore'
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
	const [requests, messages] = await Promise.all([
		SherutaDB.get({
			document_id: request_id,
			collection_name: DBCollectionName.flatShareRequests,
		}),
		DiscussionService.fetchMessages({ request_id }),
	])

	// console.log(finalDiscussions)
	// TODO: set an error page to redirect them home

	if (!requests) redirect('/')

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
						video={requests.video_url}
						images={requests.images_urls}
					/>
				</Flex>

				<Flex
					flex={1}
					minW={{ base: '100%', lg: '50%' }}
					maxW={{ base: '100%', lg: '50%' }}
					flexDir={'column'}
				>
					<ApartmentDetails
						request={JSON.stringify(requests)}
						discussions={JSON.stringify(messages)}
					/>
				</Flex>
			</Flex>
		</Flex>
	)
}
