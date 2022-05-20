import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = process.env.REACT_APP_API_URL
export default class AliceService {
	static async getUserContacts(user_id) {
		if (user_id) {
			const res = await axios(API_URL + `/alice/?for=${user_id}`, {
				headers: {
					authorization: `Bearer ${Cookies.get('token')}`,
				},
			})
			return res
		} else {
			return Promise.reject('No User ID')
		}
	}
}
