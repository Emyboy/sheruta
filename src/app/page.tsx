import { CACHE_TTL } from '@/constants'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import { HostRequestDataDetails } from '@/firebase/service/request/request.types'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import { getAllProfileSnippetDocs } from '@/firebase/service/userProfile/user-profile'
import HomePage from './(home-page)/home-page'

export const revalidate = CACHE_TTL?.SHORT

export default async function page() {
	const [locations, requests, userProfiles] = await Promise.all([
		SherutaDB.getAll({
			collection_name: DBCollectionName.locationKeyWords,
			_limit: 10,
		}),

		SherutaDB.getAll({
			collection_name: DBCollectionName.flatShareRequests,
			_limit: 30,
		}),

		getAllProfileSnippetDocs(),
	])

	// console.log(
	// 	'This it the user profile for 202:,.......................',
	// 	userProfiles,
	// )
	const finalRequests = await Promise.all(
		requests
			?.filter((request: HostRequestDataDetails) => request?._user_ref?._id)
			.map(async (request: HostRequestDataDetails) => {
				const userId = request._user_ref._id
				const user_info = await UserInfoService.get(userId)

				return {
					...request,
					user_info,
				}
			}) || [],
	)

	return (
		<HomePage
			locations={locations ? JSON.stringify(locations) : '[]'}
			states={[]}
			requests={finalRequests ? JSON.stringify(finalRequests) : '[]'}
			userProfiles={userProfiles ? JSON.stringify(userProfiles) : '[]'}
		/>
	)
}
