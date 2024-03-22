'use client'
import MainSection from '@/components/atoms/MainSection'
import { DEFAULT_PADDING } from '@/configs/theme'
import { Flex, Text } from '@chakra-ui/react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import { BiSolidBadgeCheck } from 'react-icons/bi'

type Props = {}

export default function SearchResultUsers({}: Props) {
	const query = useSearchParams();
	
	return (
		<MainSection heading={`Seekers in ${query.get('location') || ''}`} paddingX={0}>
			<Flex maxW={'99%'} overflowX={'auto'}>
				<EachUserCard />
				<EachUserCard />
				<EachUserCard />
				<EachUserCard />
				<EachUserCard />
			</Flex>
		</MainSection>
	)
}

const EachUserCard = () => {
	return (
		<Flex
			ml={DEFAULT_PADDING}
			bg="black"
			rounded={'lg'}
			h="250px"
			maxW="220px"
			minW={'220px'}
			overflow={'hidden'}
			position={'relative'}
			userSelect={'none'}
			cursor={'pointer'}
			_hover={{
				shadow: 'xl',
			}}
		>
			<Image
				fill
				src="/assets/ai/OIG2.SW.jfif"
				alt="woman"
				style={{ position: 'absolute' }}
			/>
			<Flex
				position={'absolute'}
				top={2}
				left={2}
				bg="brand"
				px="3"
				py={1}
				rounded={'lg'}
				fontSize={'xs'}
				color="white"
			>
				58% match
			</Flex>
			<Flex
				zIndex={20}
				h="full"
				w="full"
				className="overlay-sm"
				alignItems={'flex-end'}
			>
				<Flex flexDir={'column'} p={DEFAULT_PADDING} w="full">
					{/* <Text color={'white'} fontSize={'sm'} fontWeight={'light'} isTruncated mb={2}>
                        Lekki
                    </Text> */}
					<Flex w="full" gap={3}>
						<Text color={'white'} fontSize={'sm'} isTruncated>
							Chioma Igbobi
						</Text>
						<Flex alignItems={'center'} color={'blue.500'} h="full">
							<BiSolidBadgeCheck size={20} />
						</Flex>
					</Flex>
					<Text color={'white'} fontSize={'md'}>
						N243,000 <small>/month</small>
					</Text>
				</Flex>
			</Flex>
		</Flex>
	)
}
