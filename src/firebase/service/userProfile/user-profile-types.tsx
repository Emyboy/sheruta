import { Timestamp } from 'firebase/firestore'

export interface UserProfile {
	_user_id: string
	state: { name: string }
	seeking: boolean
	bio: string
	budget: number
	payment_type: string
	location_keyword: { name: string }
	service_type: string
	_user_ref: {
		_id: string
		avatar_url: string
		last_name: string
		first_name: string
	}
	promotion_expiry_date: Timestamp
}
