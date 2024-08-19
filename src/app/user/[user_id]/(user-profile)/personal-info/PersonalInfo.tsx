import { Flex } from '@chakra-ui/react'
import React from 'react'
import EachPersonalInfo from './EachPersonalInfo'
import {
	BiBriefcase,
	BiLogoFacebook,
	BiLogoInstagramAlt,
	BiLogoLinkedinSquare,
	BiLogoTwitter,
} from 'react-icons/bi'
import MainSection from '@/components/atoms/MainSection'
import MainTooltip from '@/components/atoms/MainTooltip'
import { DEFAULT_PADDING } from '@/configs/theme'
import { Data } from '@react-google-maps/api'
import { FlatShareProfileData, FlatShareProfileDataDTO } from '@/firebase/service/flat-share-profile/flat-share-profile.types';
import Link from 'next/link'

type Props = {
	data: any
}

export default function PersonalInfo({ data }: Props) {

	const _userFlatshareProfile : FlatShareProfileData = data.flatShareProfile
	
	return (
		<Flex flexDir={'column'}>
			<MainSection heading="Additional Information">
				<Flex flexWrap={'wrap'}>
					<EachPersonalInfo
						Icon={BiBriefcase}
						heading="Preferred Location"
						subHeading="N 200,000/month"
					/>
					<EachPersonalInfo
						Icon={BiBriefcase}
						heading="Budget"
						subHeading={_userFlatshareProfile?.budget}
					/>
					<EachPersonalInfo
						Icon={BiBriefcase}
						heading="Work Industry"
						subHeading={_userFlatshareProfile?.work_industry}
					/>
					<EachPersonalInfo
						Icon={BiBriefcase}
						heading="Religion"
						subHeading={_userFlatshareProfile?.religion}
					/>
					<EachPersonalInfo
						Icon={BiBriefcase}
						heading="Gender Preference"
						subHeading="mmmmmmm "
					/>
					<EachPersonalInfo
						Icon={BiBriefcase}
						heading="Employment Status"
						subHeading={data.flatShareProfile.employment_status}
					/>
				</Flex>
			</MainSection>
			<MainSection heading="Social media">
				<Flex flexWrap={'wrap'} gap={DEFAULT_PADDING}>
					<EachSocialMedia label="Twitter" Icon={BiLogoTwitter} data=""/>
					<EachSocialMedia label="Instagram" Icon={BiLogoInstagramAlt} data=""/>
					<EachSocialMedia label="Facebook" Icon={BiLogoFacebook} data=""/>
					<EachSocialMedia label="LinkedIn" Icon={BiLogoLinkedinSquare} data=""/>
				</Flex>
			</MainSection>
		</Flex>
	)
}

const EachSocialMedia = ({ Icon, label, data }: { Icon: any; label: string; data: any }) => {

	// const _userSocials: FlatShareProfileData = data.flatShareProfile
	// console.log(_userSocials.instagram)
	return (
		<MainTooltip label={label} placement="top">
			<Link href="/your-link" passHref>
			<Flex
				h={10}
				w={10}
				border={'1px'}
				rounded={'md'}
				borderColor={'border_color'}
				_hover={{}}
				_dark={{
					borderColor: 'dark_light',
					color: 'dark_lighter',
					_hover: {
						color: 'brand',
						borderColor: 'brand',
					},
				}}
				cursor={'pointer'}
				alignItems={'center'}
				justifyContent={'center'}
			>
				<Icon size={25} />
			</Flex>
			</Link>
		</MainTooltip>
	)
}
