import Skeleton from 'react-loading-skeleton'
import { Flex } from '@chakra-ui/react'
import { getRandomNumber } from '@/utils/index.utils'

export default function DotsLoading() {
	return (
		<Flex flexWrap={'wrap'} gap={3} opacity={0.2}>
			{new Array(getRandomNumber(11, 16)).fill(null).map((_) => {
				return (
					<Skeleton
						key={crypto.randomUUID()}
						width={`${getRandomNumber(40, 100)}px`}
						height={'25px'}
						borderRadius={'30px'}
					/>
				)
			})}
		</Flex>
	)
}
