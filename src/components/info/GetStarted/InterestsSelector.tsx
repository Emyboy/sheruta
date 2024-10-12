'use client'
import { Button, Flex, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import useCommon from '@/hooks/useCommon'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import { HabitData } from '@/firebase/service/options/options.types'
import FlatShareProfileService from '@/firebase/service/flat-share-profile/flat-share-profile.firebase'
import { useAuthContext } from '@/context/auth.context'
import DotsLoading from '@/components/info/GetStarted/DotsLoading'
import { getDoc } from 'firebase/firestore'
import { useOptionsContext } from '@/context/options.context'
import { saveProfileDocs } from '@/firebase/service/userProfile/user-profile'
import useAuthenticatedAxios from '@/hooks/useAxios'
import { useMutation } from '@tanstack/react-query'

export default function InterestsSelector({ done }: { done?: () => void }) {
	const {
		authState: { user, flat_share_profile },
		getAuthDependencies,
		setAuthState,
	} = useAuthContext()
	const {
		optionsState: { interests },
	} = useOptionsContext()

	const axiosInstance = useAuthenticatedAxios()

	const [loading, setLoading] = useState(false)
	const [selectedInterests, setSelectedInterests] = useState<string[]>(
		flat_share_profile?.interests || [],
	)

	const selectInterest = (interestId: string) =>
		setSelectedInterests((prevInterests) => {
			if (prevInterests.includes(interestId)) {
				return prevInterests.filter(
					(existingInterestId) => existingInterestId !== interestId,
				)
			} else {
				return [...prevInterests, interestId]
			}
		})

	const { mutate } = useMutation({
		mutationFn: async () => {
			if (user) {
				setLoading(true)

				await axiosInstance.put('/flat-share-profile', {
					interests: selectedInterests,
				})
			}
		},
		onSuccess: () => {
			setAuthState({
				// @ts-ignore
				flat_share_profile: {
					...flat_share_profile,
					interests: selectedInterests,
				},
			})

			setLoading(false)
			if (done) {
				done()
			}
		},
		onError: (err) => {
			setLoading(false)
			console.error(err)
		},
	})

	return (
		<Flex flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
			<Text
				textAlign={'center'}
				as={'h1'}
				fontSize={'3xl'}
				className={'animate__animated animate__fadeInUp animate__faster'}
			>
				{`What are your Interests ?`}
			</Text>
			<Text
				textAlign={'center'}
				color={'dark_lighter'}
				className={'animate__animated animate__fadeInUp'}
			>
				{`Select traits you want prospects to have`}
			</Text>

			<Flex
				flexWrap={'wrap'}
				gap={3}
				py={10}
				className={'animate__animated animate__fadeIn'}
			>
				{interests.map((interest) => {
					return (
						<EachOption
							isActive={selectedInterests.includes(interest._id)}
							label={interest.name}
							onClick={() => selectInterest(interest._id)}
							key={interest.slug}
						/>
					)
				})}
			</Flex>
			<br />

			<Button
				onClick={() => mutate()}
				isDisabled={!selectedInterests.length}
				isLoading={loading}
			>{`Next`}</Button>
		</Flex>
	)
}

const EachOption = ({
	label,
	onClick,
	isActive,
}: {
	label: string
	onClick: () => void
	isActive?: boolean
}) => {
	return (
		<Flex
			as={'button'}
			onClick={onClick}
			color={isActive ? 'white' : 'dark_lighter'}
			bg={isActive ? 'brand_dark' : 'none'}
			fontSize={'sm'}
			border={'1px'}
			rounded={'full'}
			py={1}
			px={3}
		>
			{label}
		</Flex>
	)
}
