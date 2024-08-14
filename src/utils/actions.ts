'use server'

import SherutaDB from '@/firebase/service/index.firebase'
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
