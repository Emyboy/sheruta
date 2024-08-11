import UploadMediaIcon from '@/assets/svg/upload-media-icon'
import { DEFAULT_PADDING } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import {
	createHostRequestDTO,
	HostRequestData,
} from '@/firebase/service/request/request.types'
import {
	Box,
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
import { Timestamp } from 'firebase/firestore'
import { StorageReference } from 'firebase/storage'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { BiMinusCircle, BiPlusCircle } from 'react-icons/bi'
import { ZodError } from 'zod'
import { HostSpaceFormProps, MediaType } from '.'

export default function UploadMedia({ formData }: HostSpaceFormProps) {
	const toast = useToast()
	const {
		authState: { user, flat_share_profile },
	} = useAuthContext()
	const router = useRouter()

	const [loading, setLoading] = useState(false)
	const [length, setLength] = useState(4)

	const [mediaData, setMediaData] = useState<MediaType>({
		images_urls: formData.images_urls || [],
		video_url: formData.video_url || null,
	})
	const [mediaDataRefs, setMediaDataRefs] = useState<StorageReference[]>(
		formData.mediaDataRefs || [],
	)

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
		if (selectedFile.size > 75 * 1024 * 1024)
			return toast({
				title: 'Video cannot be larger than 75mb',
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
		const uuid = formData.uuid

		if (mediaData.images_urls.length < length)
			return toast({
				title: `Upload at least ${length} images`,
				status: 'error',
			})

		if (!user?._id || !flat_share_profile?._user_ref)
			return toast({
				status: 'error',
				title: 'please login to upload your space ',
			})

		setLoading(true)

		const newImages = mediaData.images_urls.filter((img) =>
			img.includes('data:image/'),
		)
		const oldImages = mediaData.images_urls.filter(
			(img) => !img.includes('data:image/'),
		)
		const newVideo = mediaData.video_url?.includes('data:video/')
			? mediaData.video_url
			: null

		try {
			const userId = user?._id
			const imageUploadPromises = newImages.map((url, i) =>
				SherutaDB.uploadMedia({
					data: url,
					storageUrl: `images/requests/${userId}/${uuid}/image_${i}`,
				}),
			)

			const videoUploadPromise = newVideo
				? SherutaDB.uploadMedia({
						data: newVideo,
						storageUrl: `videos/requests/${userId}/${uuid}/video_0`,
					})
				: null

			const promises = videoUploadPromise
				? [...imageUploadPromises, videoUploadPromise]
				: imageUploadPromises

			const values = await Promise.all(promises)
			setMediaDataRefs(values.map((value) => value.ref))

			const mediaUrls = await Promise.all(
				values.map(async (url) => await SherutaDB.getMediaUrl(url.ref)),
			)

			let video_url = mediaData.video_url
			if (newVideo) {
				video_url = mediaUrls.pop() || mediaData.video_url
			}
			const images_urls = [
				...oldImages,
				...mediaUrls.filter((url) => url !== null),
			]

			const { category, service, state, area, property, ...cleanedFormData } =
				formData

			let data: HostRequestData = {
				...cleanedFormData,
				mediaDataRefs: [...formData.mediaDataRefs, ...mediaDataRefs],
				seeking: false,
				video_url,
				images_urls,
				updatedAt: Timestamp.now(),
				_user_ref: flat_share_profile?._user_ref,
			}

			createHostRequestDTO.parse(data)

			await SherutaDB.update({
				collection_name: DBCollectionName.flatShareRequests,
				data,
				document_id: uuid,
			})

			toast({
				status: 'success',
				title: 'You have successfully updated your space',
			})

			router.push('/')
		} catch (e) {
			await Promise.all(
				mediaDataRefs.map(async (ref) => await SherutaDB.deleteMedia(ref)),
			)

			if (e instanceof ZodError) {
				e.errors.forEach((error: any) => {
					console.log(
						`Validation error in ${error.path.join('.')}: ${error.message}`,
					)
				})
			} else {
				console.log('Unknown error', e)
			}
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
					<Flex
						flexDirection={'column'}
						justifyContent={'center'}
						gap={DEFAULT_PADDING}
					>
						{mediaData.images_urls.length >= 4 && length < 8 && (
							<Box
								alignSelf={'end'}
								onClick={() => setLength((prev) => prev + 1)}
								title="Add image"
							>
								<BiPlusCircle
									cursor={'pointer'}
									size={'32px'}
									fill="#00bc73"
									title="add new images"
								/>
							</Box>
						)}
						<Grid templateColumns={'repeat(2, 1fr)'} gap={6}>
							{Array.from({
								length,
							}).map((_, i) => (
								<GridItem
									w={'100%'}
									position={'relative'}
									maxH={240}
									maxW={240}
									borderRadius={'8px'}
									key={`media-${i}`}
								>
									{length > 4 && (
										<Flex
											cursor={'pointer'}
											pos={'absolute'}
											zIndex={50}
											top={'-12px'}
											right={'0'}
											bgColor={'dark'}
											rounded={'full'}
											p={0}
											onClick={() => {
												setLength((prev) => prev - 1)
												const images_urls = mediaData.images_urls.filter(
													(_, idx) => i !== idx,
												)
												setMediaData((prev) => ({ ...prev, images_urls }))
											}}
										>
											<BiMinusCircle
												size={'24px'}
												fill="#00bc73"
												title="remove house rule"
											/>
										</Flex>
									)}
									<FormLabel
										key={i}
										htmlFor={i.toString()}
										height={240}
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
												style={{ borderRadius: '8px' }}
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
											disabled={loading}
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
							<Box
								alignSelf={'end'}
								onClick={() =>
									setMediaData((prev) => ({ ...prev, video_url: null }))
								}
								title="Remove video"
								position={'absolute'}
								cursor={'pointer'}
								top={-2.5}
								right={0}
								zIndex={50}
							>
								<BiMinusCircle
									cursor={'pointer'}
									size={'32px'}
									fill="#00bc73"
								/>
							</Box>
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
							disabled={loading}
						/>
					</FormLabel>
				</VStack>
				<br />
				<Button
					disabled={loading}
					isLoading={loading}
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