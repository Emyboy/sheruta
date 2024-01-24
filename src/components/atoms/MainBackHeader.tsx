'use client'
import { Avatar, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import MainIconBtn from './MainIconBtn'
import { BiChevronLeft } from 'react-icons/bi'
import { DEFAULT_PADDING } from '@/configs/theme'
import { useRouter } from 'next13-progressbar'
import Skeleton from 'react-loading-skeleton'

type Props = {
	heading?: string
	subHeading?: string
	image_url?: string
	isLoading?: boolean
}

export default function MainBackHeader({
	heading,
	subHeading,
	isLoading,
	image_url,
}: Props) {
	const router = useRouter()
	return (
		<Flex
			h="full"
			w="full"
			maxW={'99%'}
			px={DEFAULT_PADDING}
			gap={DEFAULT_PADDING}
		>
			<MainIconBtn
				Icon={BiChevronLeft}
				label="Go back"
				onClick={() => router.back()}
			/>
			<Flex flexDirection={'column'} maxW={'full'}>
				{heading && (
					<Flex gap={2} alignItems={'center'} flex={1} h="full">
						{image_url && isLoading ? (
							<Skeleton circle height={50} width={50} />
						) : (
							<Avatar size={'sm'} src={image_url} />
						)}
						<Flex flexDir={'column'} flex={1} h="full">
							<Text
								opacity={isLoading ? '0.2' : 1}
								isTruncated
								textTransform={'capitalize'}
							>
								{isLoading ? <Skeleton width={200} height={10} /> : heading}
							</Text>
							<Text
								opacity={isLoading ? '0.2' : 1}
								isTruncated
								fontSize={'xs'}
								color="text_muted"
							>
								{isLoading ? <Skeleton width={100} height={10} /> : subHeading}
							</Text>
						</Flex>
					</Flex>
				)}
			</Flex>
		</Flex>
	)
}
