'use client'

import { DEFAULT_PADDING } from '@/configs/theme'
import { Box, Flex, Image } from '@chakra-ui/react'
import { useState } from 'react'
import { BiPlayCircle } from 'react-icons/bi'

export default function MediaCarousel({
	video,
	images,
}: {
	video: string
	images: string[]
}) {
	const [selectedMedia, setSelectedMedia] = useState(video || images[0])
	const [type, setType] = useState<'video' | 'img'>(video ? 'video' : 'img')

	return (
		<Flex
			p={DEFAULT_PADDING}
			gap={DEFAULT_PADDING}
			flexDir={'column'}
			alignItems={'center'}
			justifyContent={'center'}
			position={'relative'}
			bgColor={'dark'}
			_light={{ bgColor: 'white' }}
			borderRadius={'16px'}
			overflow={'hidden'}
			w={'100%'}
			h={'100%'}
		>
			<Box
				pos={'absolute'}
				top={0}
				right={0}
				left={0}
				bottom={0}
				bgColor={'black'}
				_light={{ bgColor: 'white' }}
				opacity={'10%'}
				backgroundImage={selectedMedia}
			/>
			<Box
				position={'relative'}
				overflow={'hidden'}
				cursor={'pointer'}
				rounded="md"
				bgColor="dark"
				_light={{ bgColor: 'white' }}
				h={'100%'}
				w={'100%'}
				border={'1.5px'}
				borderColor={'white'}
			>
				{type === 'img' ? (
					<Box bg="dark" width={'100%'} height={'100%'}>
						<Image
							src={selectedMedia}
							alt="shared space"
							width={'100%'}
							height={'100%'}
							objectFit={'cover'}
							objectPosition={'center'}
						/>
					</Box>
				) : (
					<Flex
						bgColor="dark"
						_light={{ bgColor: 'white' }}
						w={'100%'}
						h={'100%'}
						alignItems={'center'}
						justifyContent={'center'}
					>
						<iframe
							src={selectedMedia}
							// style={{
							// 	minHeight: '400px',
							// }}
							width={'100%'}
							height={'100%'}
						/>
					</Flex>
				)}
			</Box>
			<Flex
				flexDirection={'column'}
				flexWrap={'wrap'}
				alignContent={'start'}
				gap={DEFAULT_PADDING}
				w={'100%'}
				maxH={100}
				overflowX={'scroll'}
			>
				{video && (
					<Flex
						alignItems={'center'}
						justifyContent={'center'}
						position={'relative'}
						overflow={'hidden'}
						rounded="md"
						cursor={'pointer'}
						bg="dark"
						h={100}
						w={100}
						border={'1.5px'}
						borderColor={'white'}
						onClick={() => {
							setSelectedMedia(video)
							setType('video')
						}}
					>
						<Box pos="absolute" zIndex={0}>
							<BiPlayCircle size={'30px'} fill="#00bc73" cursor={'pointer'} />
						</Box>
						<video src={video} width={'100%'} height={'100%'} />
					</Flex>
				)}
				{images.map((imgUrl: any, i: number) => (
					<Box
						key={i}
						position={'relative'}
						overflow={'hidden'}
						rounded="md"
						cursor={'pointer'}
						bg="dark"
						h={100}
						w={100}
						border={'1.5px'}
						borderColor={'white'}
						onClick={() => {
							setSelectedMedia(imgUrl)
							setType('img')
						}}
					>
						<Image
							src={imgUrl}
							alt="image of the shared space"
							objectFit={'cover'}
							objectPosition={'center'}
							w={'100%'}
							h={'100%'}
						/>
					</Box>
				))}
			</Flex>
		</Flex>
	)
}
