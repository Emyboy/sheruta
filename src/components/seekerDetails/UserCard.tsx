import {
	Box,
	Flex,
	Text,
	IconButton,
	HStack,
	Icon,
	Avatar,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { BiEnvelope, BiPhone, BiSolidBadgeCheck } from 'react-icons/bi'

interface Props {
	[key: string]: any
}

const UserCard = ({
	name,
	handle,
	bio,
	profilePicture,
	userInfoDoc,
}: Props) => {
	const router = useRouter()

	return (
		<Box bgColor="#202020" borderRadius="15px">
			<Flex bg="brand_darker" p={4} alignItems="center" borderRadius="15px">
				<Avatar size="lg" src={profilePicture} />
				<Box ml={2}>
					<Flex gap={1} alignItems={'center'}>
						<Text fontWeight="bold" color="white">
							{name}
						</Text>
						{(userInfoDoc?.is_verified) ? <Icon as={BiSolidBadgeCheck} color="blue.500" ml={1} /> : null}
					</Flex>
					<Text color="#fff" fontSize="sm">
						@{handle}
					</Text>
					<Text color="#fff" fontSize="sm">
						{bio}
					</Text>
				</Box>
			</Flex>

			<HStack
				p={4}
				justifyContent={'space-between'}
				alignItems={'center'}
				bgColor={'gray.600'}
				color={'#fff'}
			>
				<Text fontWeight={'semibold'} cursor={'pointer'}>
					Book Inspection
				</Text>
				<Flex justifyContent="flex-end">
					<IconButton
						aria-label="sese"
						icon={<BiEnvelope />}
						variant="ghost"
						colorScheme="white"
						size={'md'}
						onClick={() => router.replace(`/messages/${userInfoDoc?._user_id}`)}
					/>
					{userInfoDoc?.primary_phone_number ? (
						<IconButton
							aria-label="sese"
							icon={<BiPhone />}
							variant="ghost"
							colorScheme="white"
							ml={2}
							size={'md'}
							onClick={() =>
								router.replace(`tel:${userInfoDoc.primary_phone_number}`)
							}
						/>
					) : null}
				</Flex>
			</HStack>
		</Box>
	)
}

export default UserCard
