import { DBCollectionName } from '@/firebase/service/index.firebase'
import NotificationsService, {
	NotificationsBodyMessage,
} from '@/firebase/service/notifications/notifications.firebase'
import { formatDuration, intervalToDuration } from 'date-fns'

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
		},
	})
}
