import { CACHE_TTL } from '@/constants'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import {
	FlatShareRequest,
	HostRequestDataDetails,
	SeekerRequestDataDetails,
} from '@/firebase/service/request/request.types'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import { getAllProfileSnippetDocs } from '@/firebase/service/userProfile/user-profile'
import HomePage from './(home-page)/home-page'
import { serverSession } from '@/utils/auth'
import axiosInstance from '@/utils/custom-axios'
import SuperJSON from 'superjson'

export const revalidate = CACHE_TTL?.SHORT

export const dynamic = 'force-dynamic'

type Props = {
	searchParams?: { [key: string]: string | undefined }
}

export default async function page({ searchParams }: Props) {
	const {
		data: { data: requests },
	}: {
		data: {
			data: FlatShareRequest[]
		}
	} = await axiosInstance.get(
		`/flat-share-requests?page=${searchParams?.page || 1}&limit=30`,
	)

	return <HomePage requests={requests} userProfiles={'[]'} />
}
