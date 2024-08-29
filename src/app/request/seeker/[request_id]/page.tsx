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
interface PostData {
	id: string
	updatedAt: Timestamp
	description: string
	google_location_text: string
	flat_share_profile?: any
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

	let requestData: string | undefined | PostData =
		await getRequestData(requestId)

	if (requestData) {
		requestData = SuperJSON.parse(requestData) as PostData
	}

	return (
		<Flex justifyContent={'center'}>
			<MainContainer>
				<ThreeColumnLayout header={<MainBackHeader />}>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>
					<Box p={DEFAULT_PADDING}>
						<SeekerPost
							postData={requestData as PostData}
							requestId={requestId}
						/>
					</Box>
				</ThreeColumnLayout>
				<MobileNavFooter />
			</MainContainer>
		</Flex>
	)
}

async function getRequestData(requestId: string): Promise<string | undefined> {
	try {
		const result: DocumentData | null = await SherutaDB.get({
			collection_name: 'requests',
			document_id: requestId,
		})

		if (
			result &&
			Object.keys(result).length > 0 &&
			result.flat_share_profile &&
			result._service_ref &&
			result._location_keyword_ref
		) {
			let userInfoDoc: DocumentData | undefined = undefined

			if (result?.flat_share_profile?._id) {
				userInfoDoc = await UserInfoService.get(result.flat_share_profile._id)
			}

			return SuperJSON.stringify({
				...result,
				userInfoDoc,
			})
		}

		return undefined
	} catch (error: any) {
		console.error('Error fetching request data:', error)
	}

	return undefined
}
