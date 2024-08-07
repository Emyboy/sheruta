import { Option } from '../options.types'
import { DocumentReference } from 'firebase/firestore'

export interface LocationKeywordData extends Option {
	_state_id: string
	_state_ref: DocumentReference
	_ref: DocumentReference
}
