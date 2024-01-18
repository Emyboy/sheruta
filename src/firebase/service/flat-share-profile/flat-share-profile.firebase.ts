import { DocumentReference, doc, getDoc } from 'firebase/firestore'
import SherutaDB, { DBCollectionName } from '../index.firebase'
import { FlatShareProfileDTO } from './flat-share-profle.types'
import { db } from '@/firebase'

export default class FlatShareProfileService {
    static async create({
        _user_id,
        _user_ref,
    }: {
        _user_id: string
            _user_ref: DocumentReference
    }) {
        try {
            let userInfo = await getDoc(doc(db, DBCollectionName.userInfos, _user_id))
            let data: FlatShareProfileDTO = {
                _user_info_ref: userInfo.ref,
                _user_id,
                budget: null,
                seeking: null,
                _user_ref
            };
            let result = await SherutaDB.create({
                collection_name: DBCollectionName.userSettings,
                data,
                document_id: _user_id,
            })

            return result
        } catch (error) {
            return Promise.reject(error)
        }
    }
}
