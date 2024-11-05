import { DBCollectionName } from '@/firebase/service/index.firebase'
import NotificationsService, {
	NotificationsBodyMessage,
} from '@/firebase/service/notifications/notifications.firebase'
import { formatDuration, intervalToDuration } from 'date-fns'
import {
	DocumentData,
	DocumentReference,
	getDoc,
	Timestamp,
} from 'firebase/firestore'

export const truncateText = (text: string, maxChars?: number) =>
	text.length > (maxChars || 50)
		? text.substring(0, maxChars || 50) + '... '
		: text

export const resolveArrayOfReferences = async (
	objArray: Record<any, any>[],
) => {
	if(!objArray) throw Error("Obj param must not be empty")

	const resolvedObjects = await Promise.all(
		objArray.map(async (item) => {
			// Resolve all fields that are DocumentReferences in the current item
			const refFields = Object.entries(item).filter(
				([, value]) => value instanceof DocumentReference,
			)

			const resolvedRefs = await Promise.all(
				refFields.map(async ([key, ref]) => {
					const docSnap = await getDoc(ref as DocumentReference)
					return { [key]: docSnap.exists() ? docSnap.data() : null }
				}),
			)

			// Merge resolved references back into the object
			return { ...item, ...Object.assign({}, ...resolvedRefs) }
		}),
	)

	return resolvedObjects
}

export const resolveSingleObjectReferences = async (obj: Record<any, any>) => {

	if(!obj) throw Error("Obj param must not be empty")

	const refFields = Object.entries(obj).filter(
		([, value]) => value instanceof DocumentReference,
	)

	const resolvedRefs = await Promise.all(
		refFields.map(async ([key, ref]) => {
			const docSnap = await getDoc(ref as DocumentReference)
			if (docSnap.exists()) {
				return { [key]: docSnap.data() }
			} else {
				return { [key]: null }
			}
		}),
	)

	return { ...obj, ...Object.assign({}, ...resolvedRefs) }
}

export const hasEmptyValue = (obj: any): boolean => {
	for (const key in obj) {
		if (obj[key] === '' || obj[key] === null || obj[key] === undefined) {
			return true
		}
	}
	return false
}

export function getRandomNumber(min: number, max: number): number {
	if (min > max) {
		throw new Error('Minimum value must be less than or equal to maximum value')
	}
	const randomDecimal = Math.random()
	const randomNumber = Math.floor(randomDecimal * (max - min + 1) + min)
	return randomNumber
}

export function generateNumberFromRange(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min) + min)
}

export function formatPrice(digit: number): string {
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'decimal',
		minimumFractionDigits: 0,
	})
	return formatter.format(digit)
}

export function timeAgo(updatedAt: {
	seconds: number
	nanoseconds: number
}): string {
	if (typeof updatedAt === 'undefined') return 'unknown'

	const updatedDate = new Date(
		updatedAt.seconds * 1000 + updatedAt.nanoseconds / 1000000,
	)
	const now = new Date()
	const seconds = Math.floor((now.getTime() - updatedDate.getTime()) / 1000)

	const intervals = {
		year: 365 * 24 * 60 * 60,
		month: 30 * 24 * 60 * 60,
		week: 7 * 24 * 60 * 60,
		day: 24 * 60 * 60,
		hour: 60 * 60,
		minute: 60,
		second: 1,
	}

	for (const [unit, value] of Object.entries(intervals)) {
		const result = Math.floor(seconds / value)
		if (result >= 1) {
			return `${result} ${unit}${result > 1 ? 's' : ''} ago`
		}
	}

	return 'just now'
}

export const capitalizeString = (str: string): string => {
	if (!str) return str
	return str.charAt(0).toUpperCase() + str.slice(1)
}

export function convertSeconds(seconds: number) {
	let formattedDuration

	if (seconds < 3600) {
		const duration = intervalToDuration({ start: 0, end: seconds * 1000 })
		formattedDuration = formatDuration(duration, {
			format: ['minutes', 'seconds'],
		})
	} else {
		const duration = intervalToDuration({ start: 0, end: seconds * 1000 })
		formattedDuration = formatDuration(duration, {
			format: ['hours', 'minutes', 'seconds'],
		})
	}

	return formattedDuration
}

export function convertTimestampToTime(timestamp: {
	seconds: number
	nanoseconds: number
}): string {
	const date = new Date(timestamp.seconds * 1000)

	let hours = date.getHours()
	const minutes = date.getMinutes()

	const ampm = hours >= 12 ? 'PM' : 'AM'

	hours = hours % 12
	hours = hours ? hours : 12

	const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes

	return `${hours}:${formattedMinutes}${ampm}`
}

export const handleCall = async (data: {
	number: string | null
	recipient_id: string
	sender_details: null | {
		id: string
		first_name: string
		last_name: string
		avatar_url: string
	}
}) => {
	window.location.href = `tel:${data.number}`

	await NotificationsService.create({
		collection_name: DBCollectionName.notifications,
		data: {
			type: 'call',
			is_read: false,
			message: NotificationsBodyMessage.call,
			recipient_id: data.recipient_id,
			sender_details: data.sender_details,
			action_url: '',
		},
	})
}

export const handleDM = (userId: string | null) => {
	window.location.href = `/messages/${userId}`
}

export function getTimeDifferenceInHours(timestamp?: Timestamp) {
	if (!timestamp) return 48

	const { nanoseconds, seconds } = timestamp

	const expiryInMilliseconds = seconds * 1000 + nanoseconds / 1e6

	const nowInMilliseconds = new Date().getTime()

	const hoursDifference =
		(expiryInMilliseconds - nowInMilliseconds) / (1000 * 60 * 60)

	return Math.ceil(hoursDifference)
}

// Helper function to recursively resolve DocumentReference objects
export async function resolveDocumentReferences(docData: any): Promise<any> {
	if(!docData) throw Error("data param must not be empty")

	const refFields = Object.entries(docData).filter(
		([key, value]) =>
			value instanceof DocumentReference ||
			(Array.isArray(value) &&
				value.some((v) => v instanceof DocumentReference)),
	)

	const resolvedRefs = await Promise.all(
		refFields.map(async ([key, value]) => {
			if (value instanceof DocumentReference) {
				const resolvedDoc = await getDoc(value as any)
				const resolvedData = await resolveDocumentReferences(resolvedDoc.data())
				return { [key]: { ...resolvedData, id: resolvedDoc.id } }
			} else if (Array.isArray(value)) {
				const resolvedArray = await Promise.all(
					value.map(async (item) => {
						if (item instanceof DocumentReference) {
							const resolvedDoc = await getDoc(item)
							const resolvedData = await resolveDocumentReferences(
								resolvedDoc.data(),
							)
							return { ...resolvedData, id: resolvedDoc.id }
						}
						return item
					}),
				)
				return { [key]: resolvedArray }
			}
		}),
	)

	for (const refObject of resolvedRefs) {
		Object.assign(docData, refObject)
	}

	return docData
}

export const convertRefToData = async (
	docRef: DocumentReference,
): Promise<DocumentData | undefined> => {
	try {
		const docSnap = await getDoc(docRef)

		if (docSnap.exists()) {
			return { id: docSnap.id, ...docSnap.data() }
		}

		return undefined
	} catch (err) {
		console.log(err)
	}
}

export const calculateAge = (birthdate?: string) =>
	birthdate
		? Math.floor(
				(new Date().getTime() - new Date(birthdate).getTime()) /
					(1000 * 60 * 60 * 24 * 365.25),
			)
		: null
