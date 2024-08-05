import ApartmentDetails from '@/components/HostDetails/ApartmentDetails'
import MediaCarousel from '@/components/HostDetails/MediaCarousel'
import { DEFAULT_PADDING } from '@/configs/theme'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import { Flex } from '@chakra-ui/react'

const mini_nav_items = [
	'Apartment Summary',
	'Discussion',
	'Verification',
	'Pay Details',
]

export default async function page({
	params: { request_id },
}: {
	params: { request_id: string }
}) {
	let size = {
		base: '98vw',
		lg: '1024px',
		xl: '1440px',
	}

	const request: any = await SherutaDB.get({
		document_id: request_id,
		collection_name: DBCollectionName.flatShareRequests,
	})

	return (
		<>
			<Flex
				justifyContent={'center'}
				alignItems={'center'}
				minH={'100vh'}
				pos={'relative'}
			>
				<Flex
					minH={'90vh'}
					maxH={'90vh'}
					maxW={size}
					minW={size}
					overflow={{ lg: 'hidden' }}
					flexDir={{ base: 'column', lg: 'row' }}
				>
					<Flex
						minW={{ base: '100%', lg: '50%' }}
						maxW={{ base: '100%', lg: '50%' }}
						flexFlow={'column'}
						paddingRight={DEFAULT_PADDING}
					>
						<MediaCarousel
							video={request.video_url}
							images={request.images_urls}
						/>
					</Flex>

					<Flex flex={1} flexDir={'column'}>
						<ApartmentDetails request={JSON.stringify(request)} />
					</Flex>
				</Flex>
			</Flex>
		</>
	)
}
