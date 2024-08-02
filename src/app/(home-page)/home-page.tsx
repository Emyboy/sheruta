'use client'
import { EachSeekerRequest } from '@/components/EachRequest/EachRequest'
import JoinTheCommunity from '@/components/ads/JoinTheCommunity'
import MainHeader from '@/components/layout/MainHeader'
import MainLeftNav from '@/components/layout/MainLeftNav'
import MainPageBody from '@/components/layout/MainPageBody'
import MainRightNav from '@/components/layout/MainRightNav'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { DEFAULT_PADDING } from '@/configs/theme'
import { Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
// import HomeTabs from './HomeTabs';
import dynamic from 'next/dynamic'
import MobileNavFooter from '@/components/layout/MobileNavFooter'
import { StateData } from '@/firebase/service/options/states/states.types'
import HomeTabs from './HomeTabs'
import SherutaDB from '@/firebase/service/index.firebase'

type Props = {
	locations: string
	states: StateData[]
}

export default function HomePage({ locations, states }: Props) {
	const [seekerData, setSeekerData] = useState([])

	const [isFetching, setIsFetching] = useState<boolean>(false)

	// const { authState } = useAuthContext()

	// console.log(authState)

	// const requestId = params.request_id

	// console.log(requestId)

	const getRequest = async (): Promise<any> => {
		try {
			setIsFetching(true)

			//get data from DB
			const result = await SherutaDB.getAll({
				collection_name: 'requests',
				_limit: 20,
			})

			//filter through and return final result
			const finalResult = result?.filter((data: any) => data?.seeking === true)

			console.log(finalResult)

			setSeekerData(finalResult)

			if (
				finalResult &&
				Object.keys(finalResult) &&
				typeof result?._user_ref !== 'undefined'
			) {
				// //get poster's document from database
				// const [serviceTypeDoc, locationKeywordDoc] = await Promise.all(
				// 	[
				// 		getDataFromRef(result._service_ref),
				// 		getDataFromRef(result._location_keyword_ref),
				// 	],
				// )
			} else {
				//redirect back to homepage
				// Router.push('/')
			}

			// console.log(result)

			// //"10ea2048-7eb2-451e-a4d4-e39a83fb6f30"
		} catch (error: any) {
			console.log(error)
			setIsFetching(false)
		}
	}

	useEffect(() => {
		getRequest()
	}, [])

	return (
		<>
			<MainPageBody>
				<ThreeColumnLayout header={<MainHeader />}>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>
					<Flex flexDir={'column'}>
						<HomeTabs locations={JSON.parse(locations)} states={states} />
						<JoinTheCommunity />
						<Flex flexDirection={'column'} gap={0}>
							{/* {new Array(9).fill(null).map((_, index: number) => {
								return (
									<>
										{index === 3 && <JoinTheCommunity />}
										<Flex key={Math.random()} px={DEFAULT_PADDING}>
											<EachSeekerRequest seekerData={seekerData} />
										</Flex>
									</>
								)
							})} */}
							{seekerData.map((item: any) => {
								return (
									<EachSeekerRequest key={Math.random()} seekerData={item} />
								)
							})}
						</Flex>
					</Flex>
					<Flex>
						<MainRightNav />
					</Flex>
				</ThreeColumnLayout>
				<MobileNavFooter />
			</MainPageBody>
		</>
	)
}
