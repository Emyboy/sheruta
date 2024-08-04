import { Option } from '../options.types'
import { DocumentReference } from 'firebase/firestore'

export interface StateData extends Option {
	_ref: DocumentReference;
}
