import { Badge, Flex } from '@chakra-ui/react'
import React from 'react'
import EachPersonalInfo from './EachPersonalInfo'
import {
	BiBriefcase,
	BiLogoFacebook,
	BiLogoInstagramAlt,
	BiLogoLinkedinSquare,
	BiLogoTwitter,
	BiLogoTiktok,
	BiMapPin,
	BiMoney,
	BiLogoFlask,
	BiSolidCrown,
	BiSolidIdCard,
	BiSolidGroup,
} from 'react-icons/bi'
import MainSection from '@/components/atoms/MainSection'
import MainTooltip from '@/components/atoms/MainTooltip'
import { DEFAULT_PADDING } from '@/configs/theme'
import { Data } from '@react-google-maps/api'
import {
	FlatShareProfileData,
	FlatShareProfileDataDTO,
} from '@/firebase/service/flat-share-profile/flat-share-profile.types'
import Link from 'next/link'

type Props = {
	userProfile: any
}

export default function PersonalInfo({ userProfile }: Props) {
	const _userFlatshareProfile: FlatShareProfileData =
		userProfile.flatShareProfile

	type Habits = {
		title: string
	}
	const habits: Habits[] = userProfile.flatShareProfile.habits

	const instagramUrl = `https://instagram.com/${_userFlatshareProfile.socials?.instagram}`
	const facebookUrl = `https://facebook.com/${_userFlatshareProfile.socials?.facebook}`
	const twitterUrl = `https://x.com/${_userFlatshareProfile.socials?.twitter}`
	const linkedinUrl = `https://linkedin.com/in/${_userFlatshareProfile.socials?.linkedin}`
	const tiktokUrl = `https://tiktok.com/@${_userFlatshareProfile.socials?.tiktok}`

	// const handleInstagramClick = () => {
	// 	window.open(
	// 		`https://instagram.com/${_userFlatshareProfile.instagram}`,
	// 		'_blank',
	// 	)
	// }

	// const handleFacebookClick = () => {
	// 	window.open(
	// 		`https://facebook.com/${_userFlatshareProfile.facebook}`,
	// 		'_blank',
	// 	)
	// }

	// const handleTwitterClick = () => {
	// 	window.open(`https://x.com/${_userFlatshareProfile.twitter}`, '_blank')
	// }

	// const handleLinkedInClick = () => {
	// 	window.open(
	// 		`https://linkedin.com/in/${_userFlatshareProfile.linkedin}`,
	// 		'_blank',
	// 	)
	// }

	// const handleTiktokClick = () => {
	// 	window.open(`https://tiktok.com/@${_userFlatshareProfile.tiktok}`)
	// }

	return (
		<Flex flexDir={'column'} gap={DEFAULT_PADDING}>
			<MainSection heading="Additional Information">
				<Flex flexWrap={'wrap'}>
					<EachPersonalInfo
						Icon={BiMapPin}
						heading="Preferred Location"
						subHeading={userProfile.flatShareProfile.area}
					/>
					<EachPersonalInfo
						Icon={BiMoney}
						heading="Budget"
						subHeading={_userFlatshareProfile?.budget}
					/>
					<EachPersonalInfo
						Icon={BiBriefcase}
						heading="Work Industry"
						subHeading={_userFlatshareProfile?.work_industry}
					/>
					<EachPersonalInfo
						Icon={BiLogoFlask}
						heading="Religion"
						subHeading={_userFlatshareProfile?.religion}
					/>
					<EachPersonalInfo
						Icon={BiSolidGroup}
						heading="Gender Preference"
						subHeading="To be fixed"
					/>
					<EachPersonalInfo
						Icon={BiSolidIdCard}
						heading="Employment Status"
						subHeading={_userFlatshareProfile?.employment_status}
					/>
				</Flex>
			</MainSection>
			<MainSection heading="Unique Habits">
				<Flex flexWrap={'wrap'}>
					{habits.map((item, index) => {
						return (
							<Badge
								key={index}
								bg="border_color"
								px={3}
								mx={1}
								my={2}
								rounded={'md'}
								_dark={{
									color: 'border_color',
									bg: 'dark_light',
								}}
							>
								{item.title}
							</Badge>
						)
					})}
				</Flex>
			</MainSection>
			<MainSection heading="Social media">
				<Flex flexWrap={'wrap'} gap={DEFAULT_PADDING}>
					{_userFlatshareProfile.socials?.twitter === '' ? null : (
						<EachSocialMedia
							label="Twitter"
							Icon={BiLogoTwitter}
							data=""
							url={twitterUrl}
						/>
					)}
					{_userFlatshareProfile.socials?.instagram === '' ? null : (
						<EachSocialMedia
							label="Instagram"
							Icon={BiLogoInstagramAlt}
							data=""
							url={instagramUrl}
						/>
					)}
					{_userFlatshareProfile.socials?.facebook === '' ? null : (
						<EachSocialMedia
							label="Instagram"
							Icon={BiLogoFacebook}
							data=""
							url={facebookUrl}
						/>
					)}
					{_userFlatshareProfile.socials?.linkedin === '' ? null : (
						<EachSocialMedia
							label="LinkedIn"
							Icon={BiLogoLinkedinSquare}
							data=""
							url={linkedinUrl}
						/>
					)}

					{_userFlatshareProfile.socials?.tiktok === '' ? null : (
						<EachSocialMedia
							label="Tiktok"
							Icon={BiLogoTiktok}
							data=""
							url={tiktokUrl}
						/>
					)}
				</Flex>
			</MainSection>
		</Flex>
	)
}

const EachSocialMedia = ({
	Icon,
	label,
	data,
	url,
}: {
	Icon: any
	label: string
	data: any
	url: string
}) => {
	return (
		<MainTooltip label={label} placement="top">
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
				<a href={url} target="_blank" rel="noopener noreferrer">
					<Icon size={25} />
				</a>
			</Flex>
		</MainTooltip>
	)
}
