import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import moment from 'moment'
import { createDTO } from '../index.firebase'
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
}
