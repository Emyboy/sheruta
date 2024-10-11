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
