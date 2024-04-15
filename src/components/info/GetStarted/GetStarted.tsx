import { Flex } from '@chakra-ui/react'
import { useAuthContext } from '@/context/auth.context'
import GetStartedBeginning from '@/components/info/GetStarted/GetStartedBeginning'
import GenderSelect from '@/components/forms/GenderSelector'
import { useState } from 'react'
import AuthInfoForm from '@/components/forms/AuthInfoForm'

export default function GetStarted() {
	const {
		authState: { user, flat_share_profile, user_info,user_settings },
	} = useAuthContext();
	const [step, setStep] = useState(2);

	const next = () => {
		setStep(step + 1)
	}


	if(!user) {
		return null
	}

	if(!flat_share_profile?.budget || !user_info?.gender || !flat_share_profile?.verified || !user_info?.done_kyc) {
		return (
			<Flex
				bg={'dark_light'}
				_dark={{ bg: 'dark' }}
				position={'fixed'}
				top={0}
				bottom={0}
				left={0}
				right={0}
				zIndex={500}
				flexDir={'column'}
				justifyContent={'center'}
				alignItems={'center'}
				py={'20vh'}
				overflowY={'auto'}
			>
				<Flex
					flexDir={'column'}
					minW={{
						md: '500px',
						base: '90vw',
					}}
					maxW={{
						md: '500px',
						base: '90vw',
					}}
				>
					{
						[
							<GetStartedBeginning key={'get-started'} done={next} />,
							<GenderSelect key={'my-gender'} done={next} />,
							<AuthInfoForm key={'auth-form'} done={next} />,
						][step]
					}
				</Flex>
			</Flex>
		)
	}else {
		return null
	}


}
