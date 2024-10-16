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
import axiosInstance from '@/utils/custom-axios'
import { SeekerRequestData } from '@/firebase/service/request/request.types'

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

		const { data : {data : requestData} } : {
			data : {
				data : SeekerRequestData | undefined
			}
		} = await axiosInstance.get(`/flat-share-requests/${requestId}`)


		return (requestData &&
			Object.keys(requestData).length > 0 ) ? SuperJSON.stringify(requestData): undefined

	} catch (error: any) {
		console.error('Error fetching request data:', error)
	}

	return undefined
}
