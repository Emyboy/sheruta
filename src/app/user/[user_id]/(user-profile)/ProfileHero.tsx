import { DEFAULT_PADDING } from '@/configs/theme'
import { Box, Flex, Text } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'
import { BiBriefcase, BiSolidBadgeCheck, BiSolidLocationPlus } from 'react-icons/bi'

type Props = {}

export default function ProfileHero({ }: Props) {
	return (
		<Flex gap={DEFAULT_PADDING} maxW={'60%'}>
			<Box
				position={'relative'}
				w={{
					md: '200px',
					base: '150px',
				}}
				minW={{
					md: '200px',
					base: '150px',
				}}
				h={{
					md: '250px',
					base: '150px',
				}}
				rounded={'md'}
				overflow={'hidden'}
			>
				<Image
					style={{ position: 'absolute' }}
					src={'/samples/9.png'}
					fill
					alt={'user'}
				/>
			</Box>
			<Flex maxW={'full'} flexDir={'column'} justifyContent={'flex-end'}>
				<Flex maxW={'100%'} alignItems={'center'} gap={1}>
					<Text isTruncated fontSize={'x-large'}>
						Emeka Stanley
					</Text>
					<Flex alignItems={'center'} color={'blue.400'} h="full">
						<BiSolidBadgeCheck size={25} />
					</Flex>
				</Flex>
				<Flex alignItems={'center'} gap={1} color="text_muted">
					<BiBriefcase />
					<Text as='span' color="text_muted">Software Developer</Text>
				</Flex>
				<Flex alignItems={'center'} gap={1} color="text_muted">
					<BiSolidLocationPlus />
					<Text color="text_muted" as={'span'}>
						Lekki, Lagos, Nigeria
					</Text>
				</Flex>
			</Flex>
		</Flex>
	)
}
