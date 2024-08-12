import EditHostSpace from '@/components/forms/EditHostSpace'
import MainContainer from '@/components/layout/MainContainer'
import MainHeader from '@/components/layout/MainHeader'
import MainLeftNav from '@/components/layout/MainLeftNav'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { DEFAULT_PADDING } from '@/configs/theme'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import { Box, Flex } from '@chakra-ui/react'

export default async function page({
	params: { request_id },
}: {
	params: { request_id: string }
}) {
	const request: any = await SherutaDB.get({
		document_id: request_id,
		collection_name: DBCollectionName.flatShareRequests,
	})

	return (
		<Flex justifyContent={'center'}>
			<MainContainer>
				<ThreeColumnLayout header={<MainHeader />}>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>
					<Box p={DEFAULT_PADDING}>
						<EditHostSpace data={JSON.stringify(request)} />
					</Box>
				</ThreeColumnLayout>
			</MainContainer>
		</Flex>
	)
}
