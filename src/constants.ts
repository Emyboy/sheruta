export const creditTable = {
	CONVERSATION: 200,
	VERIFICATION: 200,
	// RESERVATION: 0,
	GROUP_MESSAGE: 50,
	PERSONAL_INFO_VIEW: 500,
	// CALLS: 70,
	// VIRTUAL_INSPECTION: 1950,
	PROMOTION: 100,
	FLAT_SHARE_PROFILE_SEARCH: 50,
	RESERVATION: 5000,
	CALLS: 100,
	VIRTUAL_INSPECTION: 100,
	HOME_TAB_SEARCH: 100,
	ROUTE_CHECK: 50,
	SOCIALS_CHECK: 100,
	ROOM_RESERVATION: 5000,
	PROFILE_PROMO_7_DAYS: 3000,
	PROFILE_PROMO_14_DAYS: 5000,
	PROFILE_PROMO_30_DAYS: 8000,
	POST_PROMO_7_DAYS: 3000,
	POST_PROMO_14_DAYS: 5000,
	POST_PROMO_30_DAYS: 8000,
	BACKGROUND_CHECK: 3000,
}

export const FUNCTION_URL = process.env.NEXT_PUBLIC_CLOUD_FUNCTION_URL

export const CACHE_TTL = {
	SHORT: 20, // 20 seconds
	LONG: 1800, // 30 minutes
	LONGER: 3600, // 1 hour
}

export const homeTabSearch = [
	{
		ref: 'work_industry',
		id: 'tech space',
		title: 'Tech Space',
	},
	{
		ref: 'gender_preference',
		id: 'Females Only',
		title: 'Females Only',
	},
	{
		ref: 'gender_preference',
		id: 'Both genders',
		title: 'Both Genders',
	},
	{
		ref: 'employment_status',
		title: 'Employed',
		id: 'employed',
	},
	{
		ref: 'employment_status',
		title: 'Corps Member',
		id: 'corps member',
	},
	{
		ref: 'age_preference',
		id: '24 - 29 yrs',
		title: '24-29 years',
	},
	{
		ref: 'work_industry',
		id: 'healthcare space',
		title: 'Healthcare Space',
	},
	{
		ref: 'work_industry',
		id: 'legal space',
		title: 'Legal Space',
	},
]

export const industries = [
	'Education space',
	'Healthcare space',
	'Hospitality space',
	'Construction Space',
	'Tech space',
	'Engineering space',
	'Banking & Finance space',
	'Argricultural & Land use',
	'Wellness & fitness space',
	'Real estate space',
	'Logistics space',
	'Media Space',
	'Fashion space',
	'Media space',
	'Entreprenuer space',
	'Commerce space',
	'Sciences space',
	'Legal space',
]

export const libraries: 'places'[] = ['places']

export const whereby_base_url = 'https://sheruta-test.whereby.com/'
