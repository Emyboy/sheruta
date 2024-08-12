import {
	Box,
	Skeleton,
	SkeletonText,
	SkeletonCircle,
	Stack,
	useColorModeValue,
} from '@chakra-ui/react'

const PropertySkeleton = () => {
	const skeletonStartColor = useColorModeValue(
		'blackAlpha.600',
		'whiteAlpha.600',
	)
	const skeletonEndColor = useColorModeValue('gray.100', 'green.700')

	return (
		<Box p="4" borderWidth="0px" borderRadius="lg" overflow="hidden">
			<Stack direction="row" spacing="4" align="center" mb="4">
				<SkeletonCircle
					startColor={skeletonStartColor}
					endColor={skeletonEndColor}
					size="10"
				/>
				<Box>
					<Skeleton
						startColor={skeletonStartColor}
						endColor={skeletonEndColor}
						height="15px"
						width="150px"
						mb="2"
					/>
					<Skeleton
						startColor={skeletonStartColor}
						endColor={skeletonEndColor}
						height="10px"
						width="100px"
					/>
				</Box>
			</Stack>

			<SkeletonText
				startColor={skeletonStartColor}
				endColor={skeletonEndColor}
				mt="4"
				noOfLines={3}
				spacing="4"
			/>

			<Skeleton
				startColor={skeletonStartColor}
				endColor={skeletonEndColor}
				height="15px"
				width="80px"
				mt="4"
				mb="4"
			/>

			<Skeleton
				startColor={skeletonStartColor}
				endColor={skeletonEndColor}
				height="200px"
			/>

			<Stack direction="row" mt="4" justify="space-between" align="center">
				<Skeleton
					startColor={skeletonStartColor}
					endColor={skeletonEndColor}
					height="15px"
					width="60px"
				/>
				<Skeleton
					startColor={skeletonStartColor}
					endColor={skeletonEndColor}
					height="20px"
					width="100px"
				/>
			</Stack>
		</Box>
	)
}

export default PropertySkeleton
