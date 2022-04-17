import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = process.env.REACT_APP_API_URL
export default class {
	static async getPendingAgents() {
		const res = axios(API_URL + `/pending-agents`, {
			headers: {
				authorization: `Bearer ${Cookies.get('token')}`,
			},
		})
		return res
	}

	static async rejectPendingAgent(user_id, agent_id, reason) {
		const res = axios(API_URL + `/pending-agents/reject`, {
			method: 'POST',
			headers: {
				authorization: `Bearer ${Cookies.get('token')}`,
			},
			data: {
				users_permissions_user: user_id,
				agent: agent_id,
				reason,
			},
		})
		return res
	}

	static async acceptPendingAgent(user_id) {
		const res = axios(API_URL + `/pending-agents/accept`, {
			method: 'POST',
			headers: {
				authorization: `Bearer ${Cookies.get('token')}`,
			},
			data: { user_id },
		})
		return res
	}

	static async getAgentData() {
		const res = axios(API_URL + `/agents/me`, {
			headers: {
				authorization: `Bearer ${Cookies.get('token')}`,
			},
		})
		return res
	}


}
