import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Editor from '../Editor/Editor'
import axios from 'axios'
import { useToasts } from 'react-toast-notifications'
import Cookies from 'js-cookie'

const Email = (props) => {
	const { addToast } = useToasts()
	const [state, setState] = useState({
		loading: false,
	})
	const [emailType, setEmailType] = useState('email')

	const [data, setData] = useState({
		body: null,
		heading: null,
		actionText: null,
		actionURL: null,
	})

	useEffect(() => {
		console.log(data)
	})

	const handleSubmit = (e) => {
		e.preventDefault()
		console.log('SENDING ---', data)
		setState({ ...state, loading: true })
		axios(process.env.REACT_APP_API_URL + '/sheruta/send/email', {
			method: 'POST',
			data: { ...data, email_type: emailType },
			headers: {
				Authorization: `Bearer ${Cookies.get('token')}`,
			},
		})
			.then((res) => {
				setState({ ...state, loading: false })
				console.log(res)
				addToast('Email has been sent', {
					appearance: 'success',
					autoDismiss: true,
				})
				setData({
					...data,
					actionText: '',
					actionURL: '',
					body: '',
					heading: '',
				})
				alert('Added')
			})
			.catch((err) => {
				setState({ ...state, loading: false })
				console.log(err)
			})
	}

	return (
		<div className="container">
			<div className="text-center mb-3">
				<h1>Email Every User</h1>
			</div>
			<div className="card p-3 rounded">
				<div className="text-center">
					{['email'].map((val, i) => {
						return (
							<button
								key={`options-${i}`}
								onClick={() => setEmailType(val)}
								className={`m-1 btn ${
									emailType === val ? 'btn-success' : 'border border-success'
								} `}
							>
								{val.toUpperCase()}
							</button>
						)
					})}
				</div>
				<div className="form-group mb-3">
					<label>Email Heading</label>
					<input
						required
						type="text"
						className="form-control"
						id="inputEmailHeading"
						placeholder="Email Heading"
						onChange={(e) => setData({ ...data, heading: e.target.value })}
						defaultValue={data.heading}
					/>
				</div>
				<div className="form-group mb-3">
					<label>Call To Action Text</label>
					<input
						type="text"
						className="form-control"
						id="inputEmail3"
						placeholder="Action text"
						onChange={(e) => setData({ ...data, actionText: e.target.value })}
						defaultValue={data.actionText}
					/>
				</div>
				<div className="form-group mb-3">
					<label>Call To Action URL</label>
					<input
						type="text"
						className="form-control"
						id="inputEmail3"
						placeholder="Action URL"
						onChange={(e) => setData({ ...data, actionURL: e.target.value })}
						defaultValue={data.actionURL}
					/>
				</div>
				<Editor
					onChange={(e) => setData({ ...data, body: e })}
					data={data.body}
				/>
				<button
					type="submit"
					disabled={state.loading || (!data.heading && !data.body)}
					onClick={handleSubmit}
					className="btn mrg-0 btn-danger btn-block mt-3"
				>
					{state.loading ? 'Loading' : 'Send'}
				</button>
			</div>
		</div>
	)
}

const mapStateToProps = (state) => ({
	auth: state.auth,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Email)
