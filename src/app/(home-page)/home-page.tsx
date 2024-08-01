'use client'
import EachRequest from '@/components/EachRequest/EachRequest'
import JoinTheCommunity from '@/components/ads/JoinTheCommunity'
import MainHeader from '@/components/layout/MainHeader'
import MainLeftNav from '@/components/layout/MainLeftNav'
import MainPageBody from '@/components/layout/MainPageBody'
import MainRightNav from '@/components/layout/MainRightNav'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { DEFAULT_PADDING } from '@/configs/theme'
import { Flex } from '@chakra-ui/react'
import React from 'react'
// import HomeTabs from './HomeTabs';
import dynamic from 'next/dynamic'
import MobileNavFooter from '@/components/layout/MobileNavFooter'
import { StateData } from '@/firebase/service/options/states/states.types'
import HomeTabs from './HomeTabs'

type Props = {
	locations: string
	states: StateData[]
	requests: string
}

export default function HomePage({ locations, states, requests }: Props) {
	const flatShareRequests = requests ? JSON.parse(requests) : []
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
							{flatShareRequests.map((request: any, index: number) => {
								return (
									<>
										{index === 3 && <JoinTheCommunity />}
										<Flex key={request.uuid} px={DEFAULT_PADDING}>
											<EachRequest request={request} />
										</Flex>
									</>
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
