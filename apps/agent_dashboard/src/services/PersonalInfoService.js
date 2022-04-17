import axios from 'axios'
import Cookies from 'js-cookie';
import store from '../redux/store/store'

const API_URL = process.env.REACT_APP_API_URL
export default class PersonalInfoService {
	static async updatePersonalInfo(data) {
        alert('called')
        console.log('SENDING ---', data)
		const personal_info = store.getState().view?.personal_info;
		const res = await axios(API_URL + `/personal-info/${personal_info?.id}`, {
            method: 'PUT',
            headers: {
                authorization: `Bearer ${Cookies.get('token')}`
            },
            data
        })
        return res;
	}
}
