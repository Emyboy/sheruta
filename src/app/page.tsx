import { CACHE_TTL } from '@/constants'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import { HostRequestDataDetails } from '@/firebase/service/request/request.types'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import { getAllProfileSnippetDocs } from '@/firebase/service/userProfile/user-profile'
import HomePage from './(home-page)/home-page'

export const revalidate = CACHE_TTL?.SHORT

export const dynamic = 'force-dynamic'

type Props = {
	searchParams?: { [key: string]: string | undefined }
}

export default async function page({ searchParams }: Props) {
	const [requests, userProfiles] = await Promise.all([
		SherutaDB.getAll({
			collection_name: DBCollectionName.flatShareRequests,
			_limit: 30,
		}),
		getAllProfileSnippetDocs(searchParams || {}),
	])

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
