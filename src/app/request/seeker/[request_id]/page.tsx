import SherutaDB from '@/firebase/service/index.firebase'
import { DocumentData, Timestamp } from 'firebase/firestore'
import MainContainer from '@/components/layout/MainContainer'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import MainLeftNav from '@/components/layout/MainLeftNav'
import { DEFAULT_PADDING } from '@/configs/theme'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import SeekerPost from '@/components/seekerDetails/SeekerPost'
import SuperJSON from 'superjson'
import MainBackHeader from '@/components/atoms/MainBackHeader'
import MobileNavFooter from '@/components/layout/MobileNavFooter'
import FlatShareProfileService from '@/firebase/service/flat-share-profile/flat-share-profile.firebase'

interface PostData {
	id: string
	updatedAt: Timestamp
	description: string
	google_location_text: string
	// flat_share_profile?: any
	_service_ref?: any
	_location_keyword_ref?: any
	budget: number
	payment_type: string
	userInfoDoc?: any
}

export default async function Page({
	params,
}: {
	params: { request_id: string }
}) {
	const requestId = params.request_id

	const requestData: string | undefined = await getSeekerRequestData(requestId)

	return (
		<Flex justifyContent={'center'}>
			<MainContainer>
				<ThreeColumnLayout header={<MainBackHeader />}>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>
					<Box p={DEFAULT_PADDING}>
						<SeekerPost requestData={requestData} requestId={requestId} />
					</Box>
				</ThreeColumnLayout>
				<MobileNavFooter />
			</MainContainer>
		</Flex>
	)
}

export async function getSeekerRequestData(
	requestId: string,
): Promise<string | undefined> {
	try {
		const result: DocumentData | null = await SherutaDB.get({
			collection_name: 'requests',
			document_id: requestId,
		})

		if (
			result &&
			Object.keys(result).length > 0 &&
			result._user_ref &&
			result._service_ref &&
			result._location_keyword_ref
		) {
			if (result?._user_ref?._id) {
				const userId = result._user_ref._id

				const [user_info, flat_share_profile] = await Promise.all([
					await UserInfoService.get(userId),
					await FlatShareProfileService.get(userId),
				])

				return SuperJSON.stringify({
					...result,
					user_info,
					flat_share_profile,
				})
			} else {
				console.log('User reference not found in request document')
				return undefined
			}
		}

		return undefined
	} catch (error: any) {
		console.error('Error fetching request data:', error)
	}

	return undefined
}
