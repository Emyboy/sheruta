'use client'

import { DEFAULT_PADDING } from '@/configs/theme'
import { Button, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TbCircleLetterX } from 'react-icons/tb'

export default function ListOfFilters({ length }: { length: number }) {
	const searchParams = useSearchParams()
	const { replace } = useRouter()
	const pathname = usePathname()

	const [filters, setFilters] = useState<string[]>([])

	useEffect(() => {
		if (searchParams.toString()) {
			const rawQueries = searchParams
				.toString()
				.split('&')
				.map((query) => query.split('=')[1])
				.map((query) => query.split('%2C'))
				.flat()

			setFilters(rawQueries)
		} else {
			setFilters([])
		}
	}, [searchParams.toString()])

	return (
		<Flex
			flexDir={'column'}
			p={DEFAULT_PADDING}
			borderBottom={'1px'}
			borderColor={'border_color'}
			_dark={{ borderColor: 'dark_light' }}
		>
			<Flex flexWrap={'wrap'} gap={DEFAULT_PADDING}>
				{filters.map((filter, i) => (
					<Button
						key={i}
						display={'flex'}
						gap={2}
						alignItems={'center'}
						py={'5px'}
						px={'10px'}
						border={'1px solid #E4FAA833'}
						bgColor={'#00BC731A'}
						rounded={'15px'}
						justifyContent={'center'}
						fontSize={{ base: 'sm', md: 'base' }}
						fontWeight={300}
						_light={{ color: '#111717' }}
						color={'text_muted'}
						overflow={'hidden'}
					>
						{filter}
						{/* <TbCircleLetterX size={'16px'} /> */}
					</Button>
				))}
			</Flex>
			<Flex
				gap={DEFAULT_PADDING}
				alignItems={'center'}
				justifyContent={'space-between'}
			>
				<Text
					fontSize={{ base: 'sm', md: 'base' }}
					_light={{ color: '#111717CC' }}
				>
					{length ? `${length} Results` : 'No Apartment'}
				</Text>

				<Link href={'/'}>
					<Button
						display={'flex'}
						gap={2}
						alignItems={'center'}
						justifyContent={'center'}
						fontSize={{ base: 'sm', md: 'base' }}
						fontWeight={300}
						color={'brand'}
						bgColor={'transparent'}
						p={0}
						_hover={{ bgColor: 'transparent' }}
						onClick={() => replace(pathname)}
					>
						Clear Filters
						<TbCircleLetterX size={'16px'} />
					</Button>
				</Link>
			</Flex>
		</Flex>
	)
}
