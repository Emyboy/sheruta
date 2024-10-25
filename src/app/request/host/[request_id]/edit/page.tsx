import EditHostSpace from '@/components/forms/EditHostSpace'
import MainContainer from '@/components/layout/MainContainer'
import MainHeader from '@/components/layout/MainHeader'
import MainLeftNav from '@/components/layout/MainLeftNav'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { DEFAULT_PADDING } from '@/configs/theme'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import { FlatShareRequest } from '@/firebase/service/request/request.types'
import axiosInstance from '@/utils/custom-axios'
import { Box, Flex } from '@chakra-ui/react'

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

	return (
		<Flex justifyContent={'center'}>
			<MainContainer>
				<ThreeColumnLayout header={<MainHeader />}>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>
					<Box p={DEFAULT_PADDING}>
						<EditHostSpace request={requestData} />
					</Box>
				</ThreeColumnLayout>
			</MainContainer>
		</Flex>
	)
}
