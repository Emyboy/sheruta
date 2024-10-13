import ApartmentDetails from '@/components/HostDetails/ApartmentDetails'
import MediaCarousel from '@/components/HostDetails/MediaCarousel'
import { NINResponseDTO } from '@/components/types'
import { DEFAULT_PADDING } from '@/configs/theme'
import DiscussionService from '@/firebase/service/discussions/discussions.firebase'
import FlatShareProfileService from '@/firebase/service/flat-share-profile/flat-share-profile.firebase'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import { UserInfoDTO } from '@/firebase/service/user-info/user-info.types'
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
	const [requestData, messages] = await Promise.all([
		SherutaDB.get({
			document_id: request_id,
			collection_name: DBCollectionName.flatShareRequests,
		}),
		DiscussionService.fetchMessages({ request_id }),
	])

	let finalRequest: DocumentData | null = requestData
	let hostNinData: NINResponseDTO | undefined = undefined

	if (finalRequest && finalRequest._user_ref && finalRequest._user_ref._id) {
		const userId = finalRequest._user_ref._id
		const user_info = (await UserInfoService.get(userId)) as UserInfoDTO
		hostNinData = user_info?.nin_data
		finalRequest = { ...finalRequest, user_info }
	} else {
		console.log('User reference not found in finalRequest document')
		finalRequest = null
	}

	// console.log(finalDiscussions)
	// TODO: set an error page to redirect them home

	if (!finalRequest) redirect('/')

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
						video={finalRequest.video_url}
						images={finalRequest.images_urls}
					/>
				</Flex>

				<Flex
					flex={1}
					minW={{ base: '100%', lg: '50%' }}
					maxW={{ base: '100%', lg: '50%' }}
					flexDir={'column'}
				>
					<ApartmentDetails
						request={JSON.stringify(finalRequest)}
						discussions={JSON.stringify(messages)}
						hostNinData={hostNinData}
					/>
				</Flex>
			</Flex>
		</Flex>
	)
}
