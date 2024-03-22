import React from 'react'
import HomePage from './(home-page)/home-page'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'

export const revalidate = 50
export default async function page() {
	let locations = await SherutaDB.getAll({
		collection_name: DBCollectionName.locationKeyWords,
		_limit: 10,
	})

	return <HomePage locations={locations ? JSON.stringify(locations) : '[]'} states={[]} />
}
