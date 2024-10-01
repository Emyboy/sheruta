import MainContainer from '@/components/layout/MainContainer'
import MainHeader from '@/components/layout/MainHeader'
import MobileNavFooter from '@/components/layout/MobileNavFooter'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { HostRequestDataDetails } from '@/firebase/service/request/request.types'
import SearchApartmentService from '@/firebase/service/search/search.firebase'
import { Flex } from '@chakra-ui/react'
import SearchPageFilter from './(components)/SearchPageFilter'
import SearchPage from './search-page'

export const dynamic = 'force-dynamic'

type Props = {
	searchParams?: { [key: string]: string | undefined }
}

export default async function page({ searchParams }: Props) {
	const requests: HostRequestDataDetails[] =
		await SearchApartmentService.searchQuery({
			queryObj: searchParams,
		})

	return (
		<Flex justifyContent={'center'}>
			<MainContainer>
				<ThreeColumnLayout header={<MainHeader />}>
					<Flex flexDirection={'column'} w="full">
						<SearchPageFilter />
					</Flex>
					<SearchPage
						type={
							searchParams?.apartment === 'show-flatmates'
								? 'flatmates'
								: 'apartment'
						}
						requests={JSON.stringify(requests)}
					/>
				</ThreeColumnLayout>
				<MobileNavFooter />
			</MainContainer>
		</Flex>
	)
}
