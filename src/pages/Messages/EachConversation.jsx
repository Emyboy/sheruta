import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import MessageService from '../../services/MessageSerevice'

export default function EachConversation({ data }) {
	const { user } = useSelector((state) => state.auth)
	const otherUser = data?.owner?.id === user?.id ? data?.guest : data?.owner
	const [latestMsg, setLatestMsg] = useState('')
	const [count, setCount] = useState(0)
	const { messages } = useSelector((state) => state.message)

	useEffect(async () => {
		try {
			const latestMessage = await MessageService.getLatestConversationMessage(
				data.id
			)
			setLatestMsg(
				latestMessage.data.length > 0 && latestMessage.data[0].message_text
			)
		} catch (error) {
			return Promise.reject(error)
		}
	}, [])
	useEffect(async () => {
		setCount(messages?.filter((x) => x?.conversation?.id === data?.id)?.length)
	}, [messages])
	return (
		<li className={`${count > 0 && 'active'}`}>
			<a href="#">
				<div className="d-flex align-items-start">
					<div className="flex-shrink-0 user-img online align-self-center me-3">
						<img
							src={otherUser?.avatar_url}
							className="rounded-circle avatar-sm"
							alt=""
						/>
						<span
							className={`user-status ${!otherUser?.online && 'bg-danger'}`}
						></span>
					</div>

					<div className="flex-grow-1 overflow-hidden">
						<h5 className="text-truncate font-size-13 mb-1">
							{otherUser?.first_name}
						</h5>
						<p className="text-truncate mb-0">{latestMsg}</p>
					</div>
					<div className="flex-shrink-0">
						<div className="font-size-11">
							{moment(data?.created_at).fromNow()}
						</div>
					</div>
					{count > 0 && (
						<div className="unread-message">
							<span className="badge bg-danger rounded-pill">1</span>
						</div>
					)}
				</div>
			</a>
		</li>
	)
}
