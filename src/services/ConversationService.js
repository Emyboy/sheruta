import axios from 'axios'
import Cookies from 'js-cookie'
import store from '../redux/store/store';
import { v4 as uuid } from 'uuid'

const API_URL = process.env.REACT_APP_API_URL
const { user } = store.getState().auth
export default class ConversationService {
	static async getConversationWithUser(user_id) {
		const arr = []
		const res1 = await axios(
			API_URL + `/conversations/?owner=${user.id}&guest=${user_id}`
		)
		const res2 = await axios(
			API_URL + `/conversations/?owner=${user_id}&guest=${user.id}`
		)
		if (res1?.data && res2?.data) {
			if(res1.data.length > 0 && res2.data.length > 0){
				arr.push(res1)
				arr.push(res2)
			}
		}
		return arr
	}

	static async createNewConversationWithUser(user_id) {
		const res = axios(API_URL + `/conversations`, {
			method: 'POST',
			data: {
				owner: user?.id,
				guest: user_id,
				uuid: uuid() + '@' + user?.id + '@' + user_id,
				last_visited: new Date().toJSON(),
			},
			headers: {
				authorization: `Bearer ${Cookies.get('token')}`,
			},
		})
        return res;
	}
}
