import { Flex } from '@chakra-ui/react'
import React from 'react'
import EachPersonalInfo from './EachPersonalInfo'
import { BiBriefcase, BiLogoFacebook, BiLogoInstagramAlt, BiLogoLinkedinSquare, BiLogoTwitter } from 'react-icons/bi'
import MainSection from '@/components/atoms/MainSection'
import MainTooltip from '@/components/atoms/MainTooltip'
import { DEFAULT_PADDING } from '@/configs/theme'

type Props = {}

export default function PersonalInfo({}: Props) {
	return (
		<Flex flexDir={'column'}>
			<MainSection heading="Additional Information">
				<Flex flexWrap={'wrap'}>
					<EachPersonalInfo
						Icon={BiBriefcase}
						heading="The heading"
						subHeading="N 200,000/month"
					/>
					<EachPersonalInfo
						Icon={BiBriefcase}
						heading="The heading"
						subHeading="N 200,000/month"
					/>
					<EachPersonalInfo
						Icon={BiBriefcase}
						heading="The heading"
						subHeading="N 200,000/month"
					/>
					<EachPersonalInfo
						Icon={BiBriefcase}
						heading="The heading"
						subHeading="N 200,000/month"
					/>
				</Flex>
			</MainSection>
			<MainSection heading="Social media">
				<Flex flexWrap={'wrap'} gap={DEFAULT_PADDING}>
					<EachSocialMedia label="Twitter" Icon={BiLogoTwitter} />
					<EachSocialMedia label="Instagram" Icon={BiLogoInstagramAlt} />
					<EachSocialMedia label="Follow" Icon={BiLogoFacebook} />
					<EachSocialMedia label="LinkedIn" Icon={BiLogoLinkedinSquare} />
				</Flex>
			</MainSection>
		</Flex>
	)
}

const EachSocialMedia = ({ Icon, label }: { Icon: any; label: string }) => {
	return (
		<MainTooltip label={label} placement="top">
			<Flex
				h={10}
				w={10}
				border={'1px'}
				rounded={'md'}
				borderColor={'border_color'}
				_hover={{
					
				}}
				_dark={{
					borderColor: 'dark_light',
					color: 'dark_lighter',
					_hover: {
						color: 'brand',
						borderColor: 'brand'
					}
				}}
				cursor={'pointer'}
				alignItems={'center'}
				justifyContent={'center'}
			>
				<Icon size={25} />
			</Flex>
		</MainTooltip>
	)
}
