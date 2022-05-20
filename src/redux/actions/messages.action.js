import axios from "axios"
import Cookies from "js-cookie"
import MessageService from "../../services/MessageSerevice"



export const getAllConversations = (user_id) => async dispatch => {
    try {
        const res = await MessageService.getUserConversations(user_id)
        console.log(res)
        dispatch({
            type: 'SET_MESSAGE_STATE',
            payload: {
                conversations: res
            }
        })
    } catch (error) {
        return Promise.reject(error)
    }
}

export const getUnreadMessageCount = (user_id) => async (dispatch) => {
	if (Cookies.get('token')) {
		try {
			const msg = await MessageService.getUnreadMessages(user_id);
			dispatch({
				type: 'SET_MESSAGE_STATE',
				payload: {
					messages: msg.data,
				},
			})
		} catch (error) {
			return Promise.reject(error)
		}
	}
}