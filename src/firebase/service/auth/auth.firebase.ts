import SherutaDB from '../index.firebase'
import { RegisterDTO } from './auth.types'

export default class AuthService {
	static async register(data: RegisterDTO) {
		try {
			let result = await SherutaDB.add()
		} catch (error) {}
	}
}
