import {
	collection,
	doc,
	getDoc,
	getDocs,
	or,
	query,
	serverTimestamp,
	setDoc,
	where,
} from 'firebase/firestore'
import moment from 'moment'
import { createDTO, DBCollectionName } from '../index.firebase'
import { db } from '@/firebase'

export default class InspectionServices {
	static defaults = {
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp(),
		deleteDate: moment().add(2, 'months').toDate(),
	}

	static async create(data: createDTO): Promise<any> {
		await setDoc(doc(db, data.collection_name, data.document_id), {
			...this.defaults,
			...data.data,
		})

		let result = await getDoc(
			doc(db, data.collection_name, data.document_id as string),
		)
		return result.data()
	}

	static async getYourInspections(id: string) {
		const collectionRef = collection(db, DBCollectionName.inspections)

		const q = query(
			collectionRef,
			or(
				where('host_details.id', '==', id),
				where('seeker_details.id', '==', id),
			),
		)

		const docsSnapshot = await getDocs(q)

		return docsSnapshot.docs.map((doc) => ({
			ref: doc.ref,
			id: doc.id,
			...doc.data(),
		}))
	}
}
