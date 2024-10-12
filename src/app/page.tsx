import { CACHE_TTL } from '@/constants'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import { HostRequestDataDetails } from '@/firebase/service/request/request.types'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import { getAllProfileSnippetDocs } from '@/firebase/service/userProfile/user-profile'
import HomePage from './(home-page)/home-page'
import { serverSession } from '@/utils/auth'
import axiosInstance from '@/utils/custom-axios'

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

	// const { data } = await axiosInstance.get(`/users/dependencies`)
	// console.log(data)
	// todo save the user dependency to the context

	return (
		<HomePage
			requests={requests ? JSON.stringify(requests) : '[]'}
			userProfiles={userProfiles ? JSON.stringify(userProfiles) : '[]'}
		/>
	)
}
