export interface RegisterDTO {
	uid: string
	providerId: string
	photoURL: string
	phoneNumber?: string | null | number
	email: string
	displayName: string
}

export interface AuthUser {
	id: string
	first_name: string
	last_name: string
	email: string
	providerId: string
}
