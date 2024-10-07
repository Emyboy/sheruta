import { Box, Button, Divider, Text } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { TbCircleLetterX } from 'react-icons/tb'
import ProfileSnippetCard from './ProfileSnippetCard'

type Props = {
	userProfiles: any
}

interface UserProfile {
	state: any
	seeking: boolean
	document_id: string
	bio: string
	budget: number
	payment_type: string
	location_keyword: any
	service_type: string
	_user_ref: {
		avatar_url: string
		last_name: string
		first_name: string
	}
}

const ProfileSnippet = ({ userProfiles }: Props) => {
	const parsedUserProfile: UserProfile[] = JSON.parse(userProfiles)
	const router = useRouter()
	const params = useSearchParams()

	return (
		<React.Fragment>
			{params.toString() && (
				<Button
					w={'100%'}
					gap={2}
					mb={'-1rem'}
					p={0}
					pr={3}
					justifyContent={'end'}
					fontSize={{ base: 'sm', md: 'base' }}
					fontWeight={300}
					color={'brand'}
					bgColor={'transparent'}
					_hover={{ bgColor: 'transparent', textDecoration: 'none' }}
					onClick={() => router.push('/')}
				>
					Clear Filters
					<TbCircleLetterX size={'16px'} />
				</Button>
			)}

			{parsedUserProfile.length > 0 ? (
				parsedUserProfile.map((item, i) => (
					<ProfileSnippetCard item={item} key={i} />
				))
			) : (
				<Box>
					<Text w={'100%'} textAlign={'center'} fontWeight={600} my={4}>
						No profiles found
					</Text>
				</Box>
			)}

			<Divider />
		</React.Fragment>
	)
}

export default ProfileSnippet
