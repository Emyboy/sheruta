import React, { useEffect, useRef, useState } from 'react'
import {
	Box,
	Button,
	Center,
	Flex,
	Text,
	useColorMode,
	ModalOverlay,
} from '@chakra-ui/react'
import { BiCamera } from 'react-icons/bi'
import { Cropper, CropperRef, CircleStencil } from 'react-advanced-cropper'
import { useAuthContext } from '@/context/auth.context'
import useCommon from '@/hooks/useCommon'
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from 'firebase/storage'
import UserService from '@/firebase/service/user/user.firebase'
import { saveProfileDocs } from '@/firebase/service/userProfile/user-profile'
import { Dispatch, SetStateAction } from 'react'

interface Props {
	onShowCropper: Dispatch<SetStateAction<boolean>>
}
export const ImageSelector = ({ onShowCropper }: Props) => {
	const {
		authState: { user },
		getAuthDependencies,
	} = useAuthContext()
	const { showToast } = useCommon()
	const cropperRef = useRef<CropperRef>(null)
	const [loading, setLoading] = useState(false)
	const [showCropper, setShowCropper] = useState(false)
	const [croppedImage, setCroppedImage] = useState<string | undefined>('')
	const [selectedImage, setSelectedImage] = useState('')

	useEffect(() => {
		onShowCropper(showCropper)
	}, [showCropper])

	const onCrop = () => {
		if (cropperRef?.current) {
			setCroppedImage(cropperRef?.current?.getCanvas()?.toDataURL())
			setShowCropper(false)
		}
	}

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target?.files[0]
			const reader = new FileReader()
			reader.onload = () => {
				setSelectedImage(reader.result as string)
				setShowCropper(true)
			}
			reader.readAsDataURL(file)
		}
	}

	const handleCropComplete = (cropper: CropperRef) => {
		if (cropper) {
			return setCroppedImage(cropper?.getCanvas()?.toDataURL() as any)
		}
		setCroppedImage(selectedImage)
	}

	let uploadImage = async () => {
		setLoading(true)

		if (!user || !croppedImage) {
			return null
		}

		const base64String = croppedImage.split(',')[1]
		const byteCharacters = atob(base64String)
		const byteArrays = []
		for (let offset = 0; offset < byteCharacters.length; offset += 512) {
			const slice = byteCharacters.slice(offset, offset + 512)
			const byteNumbers = new Array(slice.length)
			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i)
			}
			const byteArray = new Uint8Array(byteNumbers)
			byteArrays.push(byteArray)
		}

		const blob = new Blob(byteArrays, { type: 'image/png' })
		const storage = getStorage()
		const storageRef = ref(storage, 'images/rivers.jpg')
		const uploadTask = uploadBytesResumable(storageRef, blob)

		uploadTask.on(
			'state_changed',
			async (snapshot) => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
				console.log('Upload is ' + progress + '% done')
				switch (snapshot.state) {
					case 'paused':
						console.log('Upload is paused')
						break
					case 'running':
						console.log('Upload is running')
						break
				}
			},
			async (error) => {
				setLoading(false)
				switch (error.code) {
					case 'storage/unauthorized':
						showToast({
							message: 'Unauthorized storage access',
							status: 'error',
						})
						break
					case 'storage/canceled':
						showToast({
							message: 'Upload canceled',
							status: 'info',
						})
						break
					case 'storage/unknown':
						showToast({
							message: 'Unknown error',
							status: 'error',
						})
						break
				}
			},
			async () => {
				getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
					console.log('DownloadURL', downloadURL)
					await UserService.update({
						data: { avatar_url: downloadURL },
						document_id: user?._id,
					})
					await saveProfileDocs({ avatar_url: downloadURL }, user?._id)
					await getAuthDependencies()
					setLoading(false)
					setShowCropper(false)
				})
			},
		)
	}

	const update = () => {
		if (selectedImage) {
			return uploadImage()
		}
	}

	return (
		<>
			{showCropper && (
				<>
					<Flex
						flexDir={'column'}
						justifyContent={'center'}
						alignItems={'center'}
						// my={'50vh'}
						gap={8}
					>
						<Text
							textAlign={'center'}
							as={'h1'}
							fontSize={'3xl'}
							className={'animate__animated animate__fadeInUp animate__faster'}
						>
							{`Crop your image`}
						</Text>
						<Flex flexDir={'column'}>
							<Box
								overflowX={'auto'}
								maxW={'95vw'}
								// h={}
								w={{
									md: '300px',
									base: '90vw',
								}}
							>
								<Cropper
									ref={cropperRef}
									src={selectedImage}
									onChange={handleCropComplete}
									stencilComponent={CircleStencil}
									stencilProps={{
										aspectRatio: 9 / 16,
									}}
								/>
								<br />
							</Box>
							<Center
								position={{
									base: 'fixed',
									md: 'relative',
								}}
								bottom={10}
							>
								<Button onClick={update} isLoading={loading}>
									Crop
								</Button>
							</Center>
						</Flex>
					</Flex>
				</>
			)}

			{!showCropper && (
				<Flex
					flexDir={'column'}
					justifyContent={'center'}
					alignItems={'center'}
				>
					<Text
						textAlign={'center'}
						as={'h1'}
						fontSize={'xl'}
						className={'animate__animated animate__fadeInUp animate__faster'}
					></Text>

					<Flex justifyContent={'center'}>
						<Flex
							cursor={'pointer'}
							htmlFor="file-selector"
							as={'label'}
							bg={'brand'}
							h={'130px'}
							w={'130px'}
							rounded={'full'}
							mt={5}
							mb={3}
							p={1}
							alignItems={'center'}
							justifyContent={'center'}
							color={'text_muted'}
						>
							{croppedImage || user?.avatar_url ? (
								<div
									style={{
										backgroundImage: `url(${croppedImage || user?.avatar_url})`,
										backgroundSize: 'cover',
										backgroundPosition: 'center',
										width: '100%',
										height: '100%',
										borderRadius: '50%',
									}}
								/>
							) : (
								<BiCamera size={50} />
							)}
						</Flex>
						<input
							type="file"
							id="file-selector"
							accept="image/*"
							onChange={handleFileSelect}
							style={{ display: 'none' }}
							justify-content={'center'}
						/>
					</Flex>
					{/* <Button onClick={update} isLoading={loading}>
						{user?.avatar_url ? 'Next' : 'Upload'}
					</Button> */}
				</Flex>
			)}
		</>
	)
}
