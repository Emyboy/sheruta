import ApartmentDetails from '@/components/HostDetails/ApartmentDetails'
import MediaCarousel from '@/components/HostDetails/MediaCarousel'
import { DEFAULT_PADDING } from '@/configs/theme'
import FlatShareProfileService from '@/firebase/service/flat-share-profile/flat-share-profile.firebase'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import { Box, Flex, Text } from '@chakra-ui/react'
import { DocumentData } from 'firebase/firestore'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FaAngleLeft } from 'react-icons/fa'

export default async function page({
	params: { request_id },
}: {
	params: { request_id: string }
}) {
	let size = {
		base: '98vw',
		xl: '1300px',
	}

	const [requestData, discussionsData] = await Promise.all([
		SherutaDB.get({
			document_id: request_id,
			collection_name: DBCollectionName.flatShareRequests,
		}),
		SherutaDB.getAll({
			collection_name: DBCollectionName.messages,
			_limit: 1000,
		})
	]);

	let finalRequest: DocumentData | null = requestData
	const discussions: any[] = discussionsData

	if (
		finalRequest &&
		Object.keys(finalRequest).length > 0 &&
		finalRequest._user_ref
	) {

		if (finalRequest?._user_ref?._id) {
			const userId = finalRequest._user_ref._id

			const [user_info, flat_share_profile] = await Promise.all([
				await UserInfoService.get(userId),
				await FlatShareProfileService.get(userId),
			])

			finalRequest = {
				...finalRequest,
				user_info,
				flat_share_profile,
			}
		} else {
			console.log('User reference not found in finalRequest document')
			finalRequest = null
		}
	}

	const finalDiscussions = discussions.filter(
		(disc: any) =>
			disc.type === 'comment' && disc?._request_ref?.uuid === request_id,
	)

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
						discussions={JSON.stringify(finalDiscussions)}
					/>
				</Flex>
			</Flex>
		</Flex>
	)
}
