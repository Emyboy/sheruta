import { CACHE_TTL } from '@/constants'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import { HostRequestDataDetails } from '@/firebase/service/request/request.types'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import { getAllProfileSnippetDocs } from '@/firebase/service/userProfile/user-profile'
import HomePage from './(home-page)/home-page'
import { serverSession } from '@/utils/auth'
import axiosInstance from '@/utils/custom-axios'

export const revalidate = CACHE_TTL?.SHORT

export default async function page({
	searchParams,
}: {
	searchParams: Record<string, string>
}) {
	const [requests, userProfiles] = await Promise.all([
		SherutaDB.getAll({
			collection_name: DBCollectionName.flatShareRequests,
			_limit: 30,
		}),
		getAllProfileSnippetDocs(searchParams),
	])

	const { data } = await axiosInstance.get(`/users/dependencies`)
	console.log(data)
	// todo save the user dependency to the context

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
			requests={finalRequests ? JSON.stringify(finalRequests) : '[]'}
			userProfiles={userProfiles ? JSON.stringify(userProfiles) : '[]'}
		/>
	)
}
