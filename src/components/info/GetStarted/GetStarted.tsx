import AuthInfoForm from '@/components/forms/AuthInfoForm'
import GenderSelect from '@/components/forms/GenderSelector'
import GetStartedBeginning from '@/components/info/GetStarted/GetStartedBeginning'
import GetStartedCompleted from '@/components/info/GetStarted/GetStartedCompleted'
import HabitsSelector from '@/components/info/GetStarted/HabitsSelector'
import InterestsSelector from '@/components/info/GetStarted/InterestsSelector'
import ProfilePictureSelector from '@/components/info/GetStarted/ProfilePictureSelector'
import SeekingStatusSelector from '@/components/info/GetStarted/SeekingStatusSelector'
import EmailVerification from '@/components/Verification/EmailVerification'
import { useAuthContext } from '@/context/auth.context'
import { Flex } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { BiLeftArrowAlt } from 'react-icons/bi'
import LocationKeywordForm from './LocationKeywordForm'
import PersonalInfoForm from './PersonalInfoForm'

export default function GetStarted() {
	const {
		authState: { user, flat_share_profile, user_info },
	} = useAuthContext()
	const [step, setStep] = useState(0)
	const [percentage, setPercentage] = useState(0)

	const next = () => {
		setStep(step + 1)
	}

	const allSteps = (): any[] => {
		return [
			<GetStartedBeginning key={'get-started'} done={next} />,
			<SeekingStatusSelector key={'agenda'} done={next} />,
			<GenderSelect key={'my-gender'} done={next} />,
			<AuthInfoForm key={'auth-form'} done={next} />,
			<HabitsSelector key={'habits'} done={next} />,
			<InterestsSelector key={'interests'} done={next} />,
			<ProfilePictureSelector key={'profile-pics'} done={next} />,
			<LocationKeywordForm key={'location-keyword'} done={next} />,
			<PersonalInfoForm key={'personal-info'} done={next} />,
			<GetStartedCompleted key={'completed'} />,
		]
	}

	useEffect(() => {
		const totalSteps = allSteps().length
		const calculatedPercentage = (step / totalSteps) * 100
		setPercentage(calculatedPercentage)
	}, [step])

	if (!user) {
		return null
	}

	// if (!user.email_verified) {
	// 	return (
	// 		<Flex
	// 			bg={'dark_light'}
	// 			_dark={{ bg: 'dark' }}
	// 			position={'fixed'}
	// 			top={0}
	// 			bottom={0}
	// 			left={0}
	// 			right={0}
	// 			zIndex={500}
	// 			flexDir={'column'}
	// 			justifyContent={'center'}
	// 			alignItems={'center'}
	// 			overflowY={'auto'}
	// 		>
	// 			<EmailVerification />
	// 		</Flex>
	// 	)
	// }

	if (
		!flat_share_profile?.budget ||
		!user_info?.gender ||
		!flat_share_profile?.occupation ||
		!user_info?.done_kyc
	) {
		return (
			<>
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
					overflowY={'auto'}
				>
					{step > 0 && step < allSteps().length - 1 ? (
						<Flex
							position={'fixed'}
							h={'5px'}
							rounded={'full'}
							overflow={'hidden'}
							top={0}
							left={0}
							right={0}
						>
							<Flex
								h={'full'}
								w={`${percentage}%`}
								bg={'brand'}
								rounded={'full'}
								transition={'width 0.5s ease-in-out'}
							/>
						</Flex>
					) : null}
					{step > 1 && step < allSteps().length - 1 ? (
						<>
							<Flex
								cursor={'pointer'}
								h={10}
								w={10}
								border={'1px'}
								rounded={'full'}
								color={'dark'}
								borderColor={'dark'}
								position={'absolute'}
								_dark={{
									borderColor: 'dark_lighter',
									color: 'dark_lighter',
								}}
								top={5}
								left={5}
								alignItems={'center'}
								justifyContent={'center'}
								onClick={() => setStep(step - 1)}
							>
								<BiLeftArrowAlt size={25} />
							</Flex>
						</>
					) : null}
					<Flex
						pt={'170px'}
						pb={'120px'}
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
						{allSteps()[step]}
					</Flex>
				</Flex>
			</>
		)
	} else {
		return null
	}
}
