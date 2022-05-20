import axios from 'axios'
import Cookies from 'js-cookie'
import store from '../redux/store/store'

const API_URL = process.env.REACT_APP_API_URL
const { user } = store.getState().auth

export default class MessageService {
	static async sendMessage({ to, message_html, conversation_id }) {
		const res = await axios(API_URL + `/messages`, {
			method: 'POST',
			data: {
				to,
				from: user?.id,
				message_html,
				conversation: conversation_id,
				seen: false,
				message_text: message_html,
			},
			headers: {
				authorization: `Bearer ${Cookies.get('token')}`,
			},
		})

		return res
	}

	static async getUserConversations(user_id) {
		const conv1 = await axios(
			process.env.REACT_APP_API_URL + `/conversations/?owner=${user_id}`,
			{
				headers: {
					authorization: `Bearer ${Cookies.get('token')}`,
				},
			}
		)
		const conv2 = await axios(
			process.env.REACT_APP_API_URL + `/conversations/?guest=${user_id}`,
			{
				headers: {
					authorization: `Bearer ${Cookies.get('token')}`,
				},
			}
		)
		// const allConv = await axios(
		//     process.env.REACT_APP_API_URL +
		//         `/conversations/?owner=${user.id}&guest=${user.id}&_sort=updated_at:DESC`,
		// );
		const sorted = [...conv1.data, ...conv2.data].sort((a, b) => {
			return new Date(b.last_visited) - new Date(a.last_visited)
		})
		return sorted
	}

	static async sendMessage(message) {
		const sent = await axios(process.env.REACT_APP_API_URL + `/messages`, {
			method: 'POST',
			data: message,
			headers: {
				authorization: `Bearer ${Cookies.get('token')}`,
			},
		})
		this.updateConversationTime(sent.data.conversation.id)
		return sent
	}

	static async getConversationMessages(conv_id) {
		const messages = await axios(
			process.env.REACT_APP_API_URL +
				`/messages/?conversation=${conv_id}&_sort=created_at:ASC`,
			{
				headers: {
					authorization: `Bearer ${Cookies.get('token')}`,
				},
			}
		)
		return messages
	}

	static async updateConversationTime(conv_id) {
		const done = await axios(
			process.env.REACT_APP_API_URL + `/conversations/${conv_id}`,
			{
				method: 'PUT',
				data: {
					updated_at: new Date().toJSON(),
					last_visited: new Date().toJSON(),
				},
				headers: {
					authorization: `Bearer ${Cookies.get('token')}`,
				},
			}
		)
		return done
	}

	static async getLatestConversationMessage(conv_id) {
		const message = await axios(
			process.env.REACT_APP_API_URL +
				`/messages/?conversation=${conv_id}&_sort=updated_at:DESC&_limit=1`,
			{
				headers: {
					authorization: `Bearer ${Cookies.get('token')}`,
				},
			}
		)
		return message
	}

	static async updateMessageSeen(message_id) {
		const message = await axios(
			process.env.REACT_APP_API_URL + `/messages/${message_id}`,
			{
				data: { seen: true },
				method: 'PUT',
				headers: {
					authorization: `Bearer ${Cookies.get('token')}`,
				},
			}
		)
		return message
	}

	static async getConversationNewMessages(conversation_id) {
		const message = await axios(
			process.env.REACT_APP_API_URL +
				`/messages/count/?conversation=${conversation_id}&seen=false&to=${
					store.getState().auth.user.user.id
				}`,
			{
				headers: {
					authorization: `Bearer ${Cookies.get('token')}`,
				},
			}
		)
		return message
	}

	static async getUnreadMessages(user_id) {
		if (user_id) {
			const messages = await axios(
				process.env.REACT_APP_API_URL + `/messages/?to=${user_id}&seen=false`,
				{
					headers: {
						authorization: `Bearer ${Cookies.get('token')}`,
					},
				}
			)
			return messages
		}
	}
}
