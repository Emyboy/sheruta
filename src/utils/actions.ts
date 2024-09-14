'use server'

import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import NotificationsService from '@/firebase/service/notifications/notifications.firebase'
import { NotificationsType } from '@/firebase/service/notifications/notifications.types'
import axios from 'axios'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const revalidatePathOnClient = (path?: string) =>
	revalidatePath(path || '/')

export const deletePost = async (id: string) => {
	await SherutaDB.delete({
		collection_name: 'requests',
		document_id: id,
	})

	revalidatePath('/')
	redirect('/')
}

export const generateRoomUrl = async (endDate: string) => {
	const API_KEY = process.env.WHEREBY_API_KEY

	try {
		const data = {
			endDate,
			fields: ['hostRoomUrl'],
		}

		const response = await axios.post(
			'https://api.whereby.dev/v1/meetings',
			data,
			{
				headers: {
					Authorization: `Bearer ${API_KEY}`,
					'Content-Type': 'application/json',
				},
			},
		)

		return response.data
	} catch (error) {
		console.log('error', error)
	}
}

export const createNotification = async (data: NotificationsType) => {
	await NotificationsService.create({
		collection_name: DBCollectionName.notifications,
		data,
	})
}
