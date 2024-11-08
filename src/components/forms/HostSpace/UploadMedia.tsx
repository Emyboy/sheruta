import UploadMediaIcon from '@/assets/svg/upload-media-icon'
import { DEFAULT_PADDING } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
import SherutaDB from '@/firebase/service/index.firebase'
import {
	createHostSpaceRequestDTO,
	HostSpaceFormData,
} from '@/firebase/service/request/request.types'
import useAnalytics from '@/hooks/useAnalytics'
import useAuthenticatedAxios from '@/hooks/useAxios'
import { revalidatePathOnClient } from '@/utils/actions'
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
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { BiMinusCircle, BiPlusCircle } from 'react-icons/bi'
import { ZodError } from 'zod'
import { HostSpaceFormProps } from '.'

export default function UploadMedia({
	formData,
	setFormData,
}: HostSpaceFormProps) {
	const router = useRouter()

	const {
		authState: { user },
	} = useAuthContext()

	const toast = useToast()

	const { addAnalyticsData } = useAnalytics()
	const axiosInstance = useAuthenticatedAxios()

	const [loading, setLoading] = useState(false)
	const [length, setLength] = useState(4)

	const [mediaRefPaths, setMediaRefPaths] = useState<string[]>([])

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
			const additionalImgs = [...formData.image_urls]
			additionalImgs[i] = reader.result as string
			setFormData((prev) => ({
				...prev,
				image_urls: additionalImgs,
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
			setFormData((prev) => ({
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

		if (formData.image_urls.length < length)
			return toast({
				title: `Upload at least ${length} images`,
				status: 'error',
			})

		if (!user)
			return toast({
				status: 'error',
				title: 'please login to upload your space ',
			})

		if (!axiosInstance)
			return toast({
				status: 'error',
				title: 'please try again later',
			})

		setLoading(true)

		try {
			const userId = user._id
			const imageUploadPromises = formData.image_urls.map((url, i) =>
				SherutaDB.uploadMedia({
					data: url,
					storageUrl: `images/requests/${userId}/${uuid}/image_${i}`,
				}),
			)

			const videoUploadPromise = formData.video_url
				? SherutaDB.uploadMedia({
						data: formData.video_url,
						storageUrl: `videos/requests/${userId}/${uuid}/video_0`,
					})
				: null

			const promises = videoUploadPromise
				? [...imageUploadPromises, videoUploadPromise]
				: imageUploadPromises

			const values = await Promise.all(promises)
			const newMediaRefPaths = values.map((value) => value.metadata.fullPath)
			setMediaRefPaths(newMediaRefPaths)

			const mediaUrls = await Promise.all(
				newMediaRefPaths.map(async (url) => SherutaDB.getMediaUrl(url)),
			)

			let video_url = null
			let videoRefPath = null
			if (formData.video_url) {
				video_url = mediaUrls.pop() || null
				videoRefPath = newMediaRefPaths.pop() || null
			}

			const image_urls = mediaUrls.filter((url) => url !== null)

			const data: HostSpaceFormData = {
				...formData,
				// imagesRefPaths: newMediaRefPaths,
				// videoRefPath,
				video_url,
				image_urls,
			}

			createHostSpaceRequestDTO.parse(data)

			const res = await axiosInstance.post('/flat-share-requests/host', data)

			revalidatePathOnClient()

			localStorage.removeItem('host_space_form')
			toast({ status: 'success', title: 'You have successfully added a space' })

			router.push(`/request/host/${res.data.data._id}`)
		} catch (e) {
			await Promise.all(
				mediaRefPaths.map((path) => SherutaDB.deleteMedia(path)),
			)

			if (e instanceof ZodError) {
				e.errors.forEach((error: any) => {
					console.log(
						`Validation error in ${error.path.join('.')}: ${error.message}`,
					)
				})
			} else {
				console.error('Unknown error', e)
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
						{formData.image_urls.length >= 4 && length < 8 && (
							<Box
								alignSelf={'end'}
								onClick={() => setLength((prev) => prev + 1)}
								title="Add image"
							>
								<BiPlusCircle
									cursor={'pointer'}
									size={'32px'}
									fill="#00bc73"
									title="add new image"
								/>
							</Box>
						)}
						<Grid
							templateColumns={{ base: 'repeat(1,fr)', sm: 'repeat(2, 1fr)' }}
							gap={6}
						>
							{Array.from({
								length,
							}).map((_, i) => (
								<GridItem
									w={'100%'}
									position={'relative'}
									maxH={250}
									maxW={250}
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
												const image_urls = formData.image_urls.filter(
													(_, idx) => i !== idx,
												)
												setFormData((prev) => ({ ...prev, image_urls }))
												console.log(image_urls)
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
										height={250}
										width={250}
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
										{formData.image_urls[i] ? (
											<Image
												src={formData.image_urls[i]}
												alt="additional Image"
												objectFit="fill"
												objectPosition="center"
												width={250}
												height={250}
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
												_light={{ bgColor: 'lightgray' }}
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
											isDisabled={loading}
										/>
									</FormLabel>
								</GridItem>
							))}
						</Grid>
					</Flex>

					<FormLabel
						htmlFor={'video'}
						height={250}
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
						{formData.video_url && (
							<Box
								alignSelf={'end'}
								onClick={() =>
									setFormData((prev) => ({ ...prev, video_url: null }))
								}
								title="Remove video"
								position={'absolute'}
								cursor={'pointer'}
								top={-2.5}
								right={'-8px'}
								zIndex={50}
								rounded={999}
							>
								<BiMinusCircle
									cursor={'pointer'}
									size={'32px'}
									fill="#00bc73"
								/>
							</Box>
						)}
						{formData.video_url ? (
							<video
								src={formData.video_url}
								style={{ borderRadius: '8px' }}
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
								_light={{ bgColor: 'lightgray' }}
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
							isDisabled={loading}
						/>
					</FormLabel>
				</VStack>
				<br />
				<Button
					isDisabled={loading}
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
