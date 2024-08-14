import SherutaDB from '@/firebase/service/index.firebase'
import { DocumentData } from 'firebase/firestore'
import MainContainer from '@/components/layout/MainContainer'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import MainLeftNav from '@/components/layout/MainLeftNav'
import { DEFAULT_PADDING } from '@/configs/theme'
import MainHeader from '@/components/layout/MainHeader'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import SeekerPost from '@/components/seekerDetails/SeekerPost'
import SuperJSON from 'superjson'

export default async function Page({
	params,
}: {
	params: { request_id: string }
}) {
	const requestId = params.request_id

	let requestData: string | undefined = await getRequestData(requestId)

	if (requestData) {
		requestData = SuperJSON.parse(requestData)
	}

	return (
		<Flex justifyContent={'center'}>
			<MainContainer>
				<ThreeColumnLayout header={<MainHeader />}>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>
					<Box p={DEFAULT_PADDING}>
						<SeekerPost postData={requestData} requestId={requestId} />
					</Box>
				</ThreeColumnLayout>
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
			result._user_ref &&
			result._service_ref &&
			result._location_keyword_ref
		) {
			let userInfoDoc: DocumentData | undefined = undefined

			if (result?._user_ref?._id) {
				userInfoDoc = await UserInfoService.get(result._user_ref._id)
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