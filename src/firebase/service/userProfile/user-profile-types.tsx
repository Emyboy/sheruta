import { OptionType } from '@/context/options.context'
import { AuthUser } from '../auth/auth.types'
import { FlatShareProfileData } from '../flat-share-profile/flat-share-profile.types'

export type PromotedUserProfiles = {
	_id: string
	user: AuthUser
	flat_share_profile: FlatShareProfileData
	endDate: Date
	location: OptionType
	state: OptionType
	service: OptionType
	pitch: string
	type: string
}
