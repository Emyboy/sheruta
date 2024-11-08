export interface NINResponseDTO {
	photo?: string
	nin: string
	title: string
	firstname: string
	lastname: string
	middlename: string
	phone: string
	birthdate: string
	nationality: string
	gender: string
	profession: string
	stateOfOrigin: string
	lgaOfOrigin: string
	placeOfOrigin: string
	maritalStatus: string
	height: string
	email: string
	employmentStatus: string
	birthState: string
	birthCountry: string
	nextOfKin: NextOfKin
	nspokenlang: string
	ospokenlang: string
	parentLastname: string
	religion: string
	residence: Residence
	signature: string
	fieldMatches: FieldMatches
}

interface NextOfKin {
	firstname: string
	lastname: string
	middlename: string
	address1: string
	address2: string
	lga: string
	state: string
	town: string
}

interface Residence {
	address1: string
	address2: string
	town: string
	lga: string
	state: string
	status: string
}

interface FieldMatches {
	lastname: boolean
	firstname: boolean
	dob: boolean
}

export type PremblyNINVerificationResponse = {
	birthcountry: string
	birthdate: string
	birthlga: string
	birthstate: string
	centralID: string
	educationallevel: string
	email: string
	employmentstatus: string
	firstname: string
	gender: string
	heigth: string
	maritalstatus: string
	middlename: string
	nin: string
	nok_address1: string
	nok_address2: string
	nok_firstname: string
	nok_lga: string
	nok_middlename: string
	nok_postalcode: string
	nok_state: string
	nok_surname: string
	nok_town: string
	ospokenlang: string
	pfirstname: string
	photo: string
	pmiddlename: string
	profession: string
	psurname: string
	religion: string
	residence_address: string
	residence_lga: string
	residence_state: string
	residence_town: string
	residencestatus: string
	self_origin_lga: string
	self_origin_place: string
	self_origin_state: string
	signature: string
	spoken_language: string
	surname: string
	telephoneno: string
	title: string
	trackingId: string
	userid: string
	vnin: string
	verification?: Record<string, any>
	session?: Record<string, any>
	endpoint_name?: string
}
