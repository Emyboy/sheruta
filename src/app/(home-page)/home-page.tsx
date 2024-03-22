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
	locations: string;
	states: StateData[]
}

export default function HomePage({ locations, states }: Props) {
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
							{new Array(9).fill(null).map((_, index: number) => {
								return (
									<>
										{index === 3 && <JoinTheCommunity />}
										<Flex key={Math.random()} px={DEFAULT_PADDING}>
											<EachRequest />
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
