'use client'
import { Avatar, Flex, Text, textDecoration } from '@chakra-ui/react'
import React from 'react'
import MainIconBtn from './MainIconBtn'
import { BiChevronLeft } from 'react-icons/bi'
import { DEFAULT_PADDING } from '@/configs/theme'
import { useRouter } from 'next13-progressbar'
import Skeleton from 'react-loading-skeleton'
import { Link } from '@chakra-ui/next-js'

type Props = {
	heading?: string
	subHeading?: string | null
	image_url?: string | null
	isLoading?: boolean
	backRoute?: string
	customHeadingRoute?: string
	px?: number | string
}

export default function MainBackHeader({
	heading,
	subHeading,
	isLoading,
	image_url,
	backRoute,
	customHeadingRoute,
	px = DEFAULT_PADDING
}: Props) {
	const router = useRouter()
	return (
		<Flex
			h="full"
			w="full"
			maxW={'99%'}
			px={px}
			gap={DEFAULT_PADDING}
		>
			<MainIconBtn
				Icon={BiChevronLeft}
				label="Go back"
				onClick={() => {
					if (backRoute) {
						return router.push(backRoute)
					}
					router.back()
				}}
			/>
			{customHeadingRoute ? (
				<>
					<Link href={customHeadingRoute} _hover={{ textDecoration: 'none' }}>
						<Flex flexDirection={'column'} maxW={'full'}>
							{heading && (
								<Flex
									gap={2}
									alignItems={'center'}
									flex={1}
									h="full"
									opacity={isLoading ? '0.2' : 1}
								>
									{image_url && isLoading ? (
										<Skeleton circle height={40} width={40} />
									) : image_url ? (
										<Avatar size={'sm'} src={image_url} />
									) : null}
									<Flex flexDir={'column'} flex={1} h="full">
										<Text
											textDecoration={'none'}
											isTruncated
											textTransform={'capitalize'}
										>
											{isLoading ? (
												<Skeleton width={200} height={10} />
											) : (
												heading
											)}
										</Text>
										<Text
											textDecoration={'none'}
											isTruncated
											fontSize={'xs'}
											color="text_muted"
										>
											{isLoading ? (
												<Skeleton width={100} height={10} />
											) : (
												subHeading
											)}
										</Text>
									</Flex>
								</Flex>
							)}
						</Flex>
					</Link>
				</>
			) : (
				<Flex flexDirection={'column'} maxW={'full'}>
					{heading && (
						<Flex
							gap={2}
							alignItems={'center'}
							flex={1}
							h="full"
							opacity={isLoading ? '0.2' : 1}
						>
							{image_url && isLoading ? (
								<Skeleton circle height={40} width={40} />
							) : image_url ? (
								<Avatar size={'sm'} src={image_url} />
							) : null}
							<Flex flexDir={'column'} flex={1} h="full">
								<Text
									textDecoration={'none'}
									isTruncated
									textTransform={'capitalize'}
								>
									{isLoading ? <Skeleton width={200} height={10} /> : heading}
								</Text>
								<Text
									textDecoration={'none'}
									isTruncated
									fontSize={'xs'}
									color="text_muted"
								>
									{isLoading ? (
										<Skeleton width={100} height={10} />
									) : (
										subHeading
									)}
								</Text>
							</Flex>
						</Flex>
					)}
				</Flex>
			)}
		</Flex>
	)
}
