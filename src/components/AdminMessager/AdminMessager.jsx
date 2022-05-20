import React, { useEffect, useState } from 'react'
import ConversationService from '../../services/ConversationService'
import MessageService from '../../services/MessageSerevice'
import Editor from '../Editor/Editor'

export default function AdminMessager({ user, done }) {
	const [message, setMessage] = useState('')
	const [loading, setLoading] = useState(false)
	const [conversation, setConversation] = useState(null)

	const getConversation = async () => {
		try {
			setLoading(true)
			const res = await ConversationService.getConversationWithUser(user?.id)
			console.log('FOUND CONVERSATION ---', res)
			if (res.length === 0) {
				const newConv = await ConversationService.createNewConversationWithUser(
					user?.id
				)
				console.log('CONV CREATED ---', newConv)
				setConversation(newConv.data)
				setLoading(false)
				console.log({
					res,
					conversation,
				})
			} else {
				setConversation(res.data)
				setLoading(false)
			}
		} catch (error) {
			console.log(error)
			setLoading(false)
			return Promise.resolve(error)
		}
	}

	const sendMessage = async () => {
		try {
			const res = await MessageService.sendMessage({
				to: user?.id,
				conversation_id: conversation?.id,
				message_html: message,
			})
			console.log(res.data)
			if(done){
				done();
				alert('SENT')
			}
		} catch (error) {
			console.log(error)
			return Promise.reject(error)
		}
	}

	useEffect(() => {
		getConversation()
	}, [])

	return (
		<div>
			<h4>Send Message</h4>
			{conversation && (
				<div className="badge bg-success mb-2">Conversation set</div>
			)}
			<Editor onChange={(e) => setMessage(e)} data={message} />
			<div className="col-md-4 col-sm-12 mt-3">
				<button
					className="btn btn-danger w-100"
					disabled={!message || loading}
					onClick={() => sendMessage()}
				>
					{loading ? (
						'Loading ...'
					) : (
						<small>
							<i className="mdi mdi-send ml-4 "></i>Send
						</small>
					)}
				</button>
			</div>
		</div>
	)
}
