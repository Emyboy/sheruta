import { db } from '@/firebase'
import { resolveDocumentReferences } from '@/utils/index.utils'
import {
	collection,
	doc,
	getDocs,
	limit,
	orderBy,
	query,
	where,
} from 'firebase/firestore'
import { DBCollectionName } from '../index.firebase'

interface QueryObj {
	budget?: string
	service?: string
	location?: string
	state?: string
	payment_type?: string
	apartment?: string
}

export default class SearchApartmentService {
	static async searchQuery({
		_limit = 20,
		queryObj = {},
	}: {
		_limit?: number
		queryObj?: QueryObj
	}) {
		try {
			const collectionRef = collection(
				db,
				queryObj.apartment === 'show-flatmates'
					? DBCollectionName.flatShareProfile
					: DBCollectionName.flatShareRequests,
			)

			let q = query(collectionRef, orderBy('updatedAt', 'desc'), limit(_limit))

			q = this.applyQueryFilters(q, queryObj)

			const querySnapshot = await getDocs(q)
			const documents = await Promise.all(
				querySnapshot.docs.map(async (doc) => {
					const docData = { ...doc.data() }
					const resolvedData = await resolveDocumentReferences(docData)
					return { id: doc.id, ...resolvedData, ref: doc.ref }
				}),
			)

			return documents
		} catch (error: any) {
			console.error('Error fetching documents:', error)
			throw new Error('Failed to fetch documents')
		}
	}

	private static applyQueryFilters(q: any, queryObj: QueryObj): any {
		if (queryObj.budget) {
			const budgetRanges = queryObj.budget
				.split(',')
				.map((range) => range.split('-').map(Number))
				.sort((a, b) => a[0] - b[0])

			q = query(
				q,
				where('budget', '>=', budgetRanges[0][0]),
				where('budget', '<=', budgetRanges[budgetRanges.length - 1][1]),
			)
		}

		if (queryObj.payment_type) {
			const paymentTypes = queryObj.payment_type.split(',')
			q = query(q, where('payment_type', 'in', paymentTypes))
		}

		if (queryObj.service) {
			const serviceRefs = queryObj.service
				.split(',')
				.map((service) => doc(db, `/services/${service}`))
			q = query(q, where('_service_ref', 'in', serviceRefs))
		}

		if (queryObj.location) {
			const locationRefs = queryObj.location
				.split(',')
				.map((location) => doc(db, `/location_keywords/${location}`))
			q = query(q, where('_location_keyword_ref', 'in', locationRefs))
		}

		if (queryObj.state) {
			const stateRefs = queryObj.state
				.split(',')
				.map((state) => doc(db, `/states/${state}`))
			q = query(q, where('_state_ref', 'in', stateRefs))
		}

		return q
	}
}
