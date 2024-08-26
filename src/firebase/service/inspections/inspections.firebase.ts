import { db } from '@/firebase'
import {
	collection,
	doc,
	getDoc,
	getDocs,
	or,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
	where,
} from 'firebase/firestore'
import moment from 'moment'
import { createDTO, DBCollectionName } from '../index.firebase'

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
			orderBy('inspection_date', 'asc'),
		)

		const docsSnapshot = await getDocs(q)

		return docsSnapshot.docs.map((doc) => ({
			ref: doc.ref,
			id: doc.id,
			...doc.data(),
		}))
	}

	static async update(data: createDTO) {
		const ref = doc(db, data.collection_name, data.document_id)
		await updateDoc(ref, {
			...data.data,
			updatedAt: serverTimestamp(),
		})

		const docSnap = await getDoc(ref)
		return docSnap.data()
	}
}
