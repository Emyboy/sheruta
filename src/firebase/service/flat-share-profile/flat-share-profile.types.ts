export interface FlatShareProfileDTO {
	_user_info_ref: any
	_user_id: string
	_user_ref: any
	seeking: boolean | null
	budget: null | number
	credits: number
	occupation: string | null
	location_keyword: any
	state: any
}

export interface FlatShareProfileData {
	_user_info_ref: any
	_user_id: string
	_user_ref: any
	seeking: boolean | null
	budget: null | number
	credits: number

	occupation?: string | null
	location_keyword?: any | null
	state?: any | null

	habits: any[]
}
