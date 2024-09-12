import React from 'react'
import HomePage from './(home-page)/home-page'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import { CACHE_TTL } from '@/constants'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import FlatShareProfileService from '@/firebase/service/flat-share-profile/flat-share-profile.firebase'
import { HostRequestDataDetails } from '@/firebase/service/request/request.types'

export const revalidate = CACHE_TTL?.SHORT

export default async function page() {
	const [locations, requests] = await Promise.all([
		await SherutaDB.getAll({
			collection_name: DBCollectionName.locationKeyWords,
			_limit: 10,
		}),

		await SherutaDB.getAll({
			collection_name: DBCollectionName.flatShareRequests,
			_limit: 30,
		}),
	])

	const finalRequests = await Promise.all(
		requests
			?.filter((request: HostRequestDataDetails) => request?._user_ref?._id)
			.map(async (request: HostRequestDataDetails) => {
				const userId = request._user_ref._id
				const user_info = await UserInfoService.get(userId)

				return {
					...request,
					user_info
				}
			}) || [],
	)

	return (
		<HomePage
			locations={locations ? JSON.stringify(locations) : '[]'}
			states={[]}
			requests={finalRequests ? JSON.stringify(finalRequests) : '[]'}
		/>
	)
}
