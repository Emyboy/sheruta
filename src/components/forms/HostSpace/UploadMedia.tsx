import UploadMediaIcon from '@/assets/svg/upload-media-icon'
import {
	Button,
	Flex,
	FormLabel,
	Grid,
	GridItem,
	Input,
	Text,
	useToast,
	VStack,
} from '@chakra-ui/react'
import Image from 'next/image'
import React, { useState } from 'react'
import { HostSpaceFormProps } from '.'
import { useAuthContext } from '@/context/auth.context'
import SherutaDB from '@/firebase/service/index.firebase'

export default function UploadMedia({
	next,
	formData,
	setFormData,
}: HostSpaceFormProps) {
	const toast = useToast()
	const {
		authState: { user },
	} = useAuthContext()

	const [loading, setLoading] = useState(false)

	const [mediaData, setMediaData] = useState<{
		images: string[]
		video: string
	}>({
		images: [],
		video: '',
	})

	const handleUploadImages = (
		e: React.ChangeEvent<HTMLInputElement>,
		i: number,
	) => {
		if (!e.target.files) return
		const selectedFile = e.target.files[0]

		if (!selectedFile.type.includes('image'))
			return toast({ title: 'Please select images only', status: 'error' })
		if (selectedFile.size > 10 * 1024 * 1024)
			return toast({
				title: 'Images cannot be larger than 10mb',
				status: 'error',
			})

		const reader = new FileReader()
		reader.readAsDataURL(selectedFile)
		reader.onload = () => {
			const additionalImgs = [...mediaData.images]
			additionalImgs[i] = reader.result as string
			setMediaData((prev) => ({
				...prev,
				images: additionalImgs,
			}))
		}
		reader.onerror = (err) => {
			console.error(err)
			return toast({
				title: 'Error occured while reading the image',
				status: 'error',
			})
		}
	}

	const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return
		const selectedFile = e.target.files[0]

		if (!selectedFile.type.includes('video'))
			return toast({ title: 'Please select video only', status: 'error' })
		if (selectedFile.size > 20 * 1024 * 1024)
			return toast({
				title: 'Video cannot be larger than 20mb',
				status: 'error',
			})

		const reader = new FileReader()
		reader.readAsDataURL(selectedFile)
		reader.onload = () => {
			setMediaData((prev) => ({
				...prev,
				video: reader.result as string,
			}))
		}
		reader.onerror = (err) => {
			console.error(err)
			return toast({
				title: 'Error occured while reading the image',
				status: 'error',
			})
		}
	}

	const handleSubmit = async (e: any) => {
		setLoading(true)
		e.preventDefault()
		if (mediaData.images.length < 4)
			return toast({
				title: 'Upload either an image or a video',
				status: 'error',
			})

		const userId = user?._id
		const imageUploadPromises = mediaData.images.map((url, i) =>
			SherutaDB.uploadMedia({
				data: url,
				storageUrl: `images/requests/${userId}/${crypto.randomUUID()}/image_${i}`,
			}),
		)

		const videoUploadPromise = mediaData.video
			? SherutaDB.uploadMedia({
					data: mediaData.video,
					storageUrl: `videos/requests/${userId}/${crypto.randomUUID()}/video_0`,
				})
			: null

		const promises = videoUploadPromise
			? [...imageUploadPromises, videoUploadPromise]
			: imageUploadPromises

		Promise.all(promises)
			.then((values) => {
				const res = [...values]
				let video_url = undefined

				if (mediaData.video) {
					video_url = res.pop()?.metadata.fullPath
				}
				const images_urls = res.map((result) => result.metadata.fullPath)

				setFormData((prev) => ({ ...prev, video_url, images_urls }))
			})
			.catch((error) => {
				console.error('Error uploading media:', error)
				toast({ title: 'Error uploading media', status: 'error' })
			})

		setLoading(false)
		// next()
	}

	return (
		<>
			<Flex
				onSubmit={handleSubmit}
				flexDir={'column'}
				justifyContent={'center'}
				alignItems={'center'}
				as={'form'}
				w={'full'}
			>
				<br />
				<VStack spacing={6} mb={3} w={'full'}>
					<Grid templateColumns={'repeat(2, 1fr)'} gap={6}>
						{Array.from({ length: 4 }).map((_, i) => (
							<GridItem w={'100%'}>
								<FormLabel
									key={i}
									htmlFor={i.toString()}
									height={240}
									w={240}
									borderRadius={'4px'}
									display={'flex'}
									transition={'all'}
									transitionDuration={'300ms'}
									cursor={'pointer'}
									_active={{
										scale: 95,
										opacity: 25,
									}}
									overflow={'hidden'}
								>
									{mediaData.images[i] ? (
										<Image
											src={mediaData.images[i]}
											alt="additional Image"
											objectFit="fill"
											objectPosition="center"
											width={240}
											height={240}
										/>
									) : (
										<Flex
											justifyContent={'center'}
											alignItems={'center'}
											gap={2}
											w={'100%'}
											h={'100%'}
											borderRadius={'8px'}
											borderColor={'border_color'}
											border={'1px'}
											borderStyle={'dashed'}
											backgroundColor={'gray'}
											padding={'8px'}
										>
											<Flex
												justifyContent={'center'}
												alignItems={'center'}
												gap={2}
												flexDirection={'column'}
											>
												<UploadMediaIcon />
												<Text
													as={'h4'}
													fontSize={'base'}
													textAlign={'center'}
													color={'text_muted'}
													fontWeight={'medium'}
												>
													Upload Image
												</Text>
											</Flex>
										</Flex>
									)}
									<Input
										title="upload image"
										type="file"
										id={i.toString()}
										accept="image/*"
										display={'none'}
										onChange={(e) => handleUploadImages(e, i)}
									/>
								</FormLabel>
							</GridItem>
						))}
					</Grid>

					<FormLabel
						htmlFor={'video'}
						height={240}
						paddingInline={7}
						w={'100%'}
						borderRadius={'8px'}
						display={'flex'}
						transition={'all'}
						transitionDuration={'300ms'}
						cursor={'pointer'}
						_active={{
							scale: 95,
							opacity: 25,
						}}
						overflow={'hidden'}
					>
						{mediaData.video ? (
							<video
								src={mediaData.video}
								className="w-full h-full"
								width={'100%'}
								height={'100%'}
							/>
						) : (
							<Flex
								justifyContent={'center'}
								alignItems={'center'}
								gap={2}
								w={'100%'}
								h={'100%'}
								borderRadius={'8px'}
								borderColor={'border_color'}
								border={'1px'}
								borderStyle={'dashed'}
								backgroundColor={'gray'}
								padding={'8px'}
							>
								<Flex
									justifyContent={'center'}
									alignItems={'center'}
									gap={2}
									flexDirection={'column'}
								>
									<UploadMediaIcon />
									<Text
										as={'h4'}
										fontSize={'base'}
										textAlign={'center'}
										color={'text_muted'}
										fontWeight={'medium'}
									>
										Upload Video
									</Text>
								</Flex>
							</Flex>
						)}
						<Input
							title="upload image"
							type="file"
							id={'video'}
							accept="video/*"
							display={'none'}
							onChange={handleVideoUpload}
						/>
					</FormLabel>
				</VStack>
				<br />
				<Button disabled={loading} type={'submit'}>
					{loading ? 'Loading...' : 'Next'}
				</Button>
			</Flex>
		</>
	)
}
