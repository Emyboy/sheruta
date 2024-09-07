'use server'

import SherutaDB from '@/firebase/service/index.firebase'
import axios from 'axios'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const deletePost = async (id: string) => {
	await SherutaDB.delete({
		collection_name: 'requests',
		document_id: id,
	})

	revalidatePath('/')
	redirect('/')
}

export const createPost = async () => {}

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
