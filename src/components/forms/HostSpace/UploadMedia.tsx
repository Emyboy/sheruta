import UploadMediaIcon from '@/assets/svg/upload-media-icon'
import { useAuthContext } from '@/context/auth.context'
import SherutaDB from '@/firebase/service/index.firebase'
import { createHostRequestDTO } from '@/firebase/service/request/request.types'
import {
	Button,
	Flex,
	FormLabel,
	Grid,
	GridItem,
	Input,
	Spinner,
	Text,
	useToast,
	VStack,
} from '@chakra-ui/react'
import Image from 'next/image'
import React, { useState } from 'react'
import { HostSpaceFormProps, MediaType } from '.'
import { Timestamp } from 'firebase/firestore'

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
	const [length, setLength] = useState(4)

	const [mediaData, setMediaData] = useState<MediaType>({
		images_urls: [],
		video_url: null,
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
			const additionalImgs = [...mediaData.images_urls]
			additionalImgs[i] = reader.result as string
			setMediaData((prev) => ({
				...prev,
				images_urls: additionalImgs,
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
				video_url: reader.result as string,
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
		e.preventDefault()
		const uuid = crypto.randomUUID()

		if (mediaData.images_urls.length < length)
			return toast({
				title: `Upload at least ${length} images`,
				status: 'error',
			})

		setLoading(true)

		const userId = user?._id
		const imageUploadPromises = mediaData.images_urls.map((url, i) =>
			SherutaDB.uploadMedia({
				data: url,
				storageUrl: `images/requests/${userId}/${uuid}/image_${i}`,
			}),
		)

		const videoUploadPromise = mediaData.video_url
			? SherutaDB.uploadMedia({
					data: mediaData.video_url,
					storageUrl: `videos/requests/${userId}/${uuid}/video_0`,
				})
			: null

		const promises = videoUploadPromise
			? [...imageUploadPromises, videoUploadPromise]
			: imageUploadPromises

		Promise.all(promises)
			.then((values) => {
				const res = [...values]
				let video_url = undefined

				if (mediaData.video_url) {
					video_url = res.pop()?.metadata.fullPath
				}
				const images_urls = res.map((result) => result.metadata.fullPath)

				setFormData((prev) => ({ ...prev, video_url, images_urls }))
			})
			.catch((error) => {
				console.error('Error uploading media:', error)
				return toast({ title: 'Error uploading media', status: 'error' })
			})

		try {
			let data = {
				...formData,
				uuid,
				seeking: false,
				createdAt: new Timestamp(0, 0),
				updatedAt: new Timestamp(0, 0),
			}

			delete data.category
			delete data.service
			delete data.state
			delete data.area
			delete data.property

			// console.log(data)

			// data = createHostRequestDTO.parse(data)

			await SherutaDB.create({
				collection_name: 'requests',
				data,
				document_id: uuid,
			})

			localStorage.removeItem('host_space_form')
			toast({ status: 'success', title: 'You have successfully added a space' })
		} catch (error) {
			console.log(error)
			// mediaData.images_urls.forEach()
			toast({ title: 'Error creating your details', status: 'error' })
		}

		setLoading(false)
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
					<Flex flexDirection={'column'} gap={2} w={'100%'}>
						{mediaData.images_urls.length >= 4 &&
							mediaData.images_urls.length < 8 && (
								<Button
									padding={'1rem'}
									borderRadius={999}
									bgColor={'brand'}
									color={'white'}
									alignSelf={'end'}
									onClick={() => setLength((prev) => prev + 1)}
									title="Add image"
								>
									+
								</Button>
							)}
						<Grid templateColumns={'repeat(2, 1fr)'} gap={6}>
							{Array.from({
								length,
							}).map((_, i) => (
								<GridItem key={i} w={'100%'} position={'relative'}>
									{length > 4 && (
										<Flex
											padding={'0.5rem'}
											alignItems={'center'}
											justifyContent={'center'}
											w={6}
											h={6}
											borderRadius={999}
											bgColor={'brand'}
											color={'white'}
											alignSelf={'end'}
											onClick={() => {
												setLength((prev) => prev - 1)
												const images_urls = mediaData.images_urls.filter(
													(_, idx) => i !== idx,
												)
												setMediaData((prev) => ({ ...prev, images_urls }))
											}}
											title="Remove image"
											position={'absolute'}
											cursor={'pointer'}
											top={-2.5}
											right={0}
											zIndex={50}
										>
											-
										</Flex>
									)}
									<FormLabel
										key={i}
										htmlFor={i.toString()}
										height={240}
										w={240}
										borderRadius={'4px'}
										display={'flex'}
										transition={'all'}
										transitionDuration={'300ms'}
										position={'relative'}
										cursor={'pointer'}
										_active={{
											scale: 95,
											opacity: 25,
										}}
									>
										{mediaData.images_urls[i] ? (
											<Image
												src={mediaData.images_urls[i]}
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
												position={'relative'}
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
					</Flex>

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
						position={'relative'}
					>
						{mediaData.video_url && (
							<Flex
								padding={'0.5rem'}
								alignItems={'center'}
								justifyContent={'center'}
								w={6}
								h={6}
								borderRadius={999}
								bgColor={'brand'}
								color={'white'}
								alignSelf={'end'}
								onClick={() =>
									setMediaData((prev) => ({ ...prev, video_url: null }))
								}
								title="Remove image"
								position={'absolute'}
								cursor={'pointer'}
								top={-2.5}
								right={0}
								zIndex={50}
							>
								-
							</Flex>
						)}
						{mediaData.video_url ? (
							<video
								src={mediaData.video_url}
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
				<Button
					disabled={loading}
					bgColor={'brand'}
					w={'100%'}
					type={'submit'}
					_hover={{
						bgColor: 'brand_light',
					}}
					display={'flex'}
					alignItems={'center'}
					justifyContent={'center'}
				>
					{loading ? <Spinner /> : 'Submit'}
				</Button>
			</Flex>
		</>
	)
}
