import { Button, Flex, Text } from '@chakra-ui/react'
import { useAuthContext } from '@/context/auth.context'
import Image from 'next/image'

export default function GetStartedBeginning({ done }: { done: () => void }) {
	const {
		authState: { user, user_info, flat_share_profile },
	} = useAuthContext()

	// if (!user || !user_info || !flat_share_profile) {
	// 	return null
	// }

	return (
		<Flex flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
			<Image src={'/icon_green.png'} alt={'sheruta'} width={70} height={70} />
			<br />
			<Text textAlign={'center'} as={'h1'} fontSize={'3xl'}>
				Hi, {user?.first_name} welcome 👋🏽
			</Text>
			<Text textAlign={'center'} color={'dark_lighter'}>
				To get you started quickly, let us know what
				<br /> brings you to Sheruta.
			</Text>
			<br />
			<br />
			<br />
			<Button onClick={done}>{`Ok let's go`}</Button>
		</Flex>
	)
}
