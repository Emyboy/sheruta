import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { DeleteFirebaseImage } from '../../services/FirebaseService'

const EachBlogPost = ({ data }) => {
	const { user } = useSelector((state) => state.auth)
	const [deleted, setDeleted] = useState(false)

	const deletePost = async () => {
		try {
			const res = await axios(
				process.env.REACT_APP_API_URL + `/blogs/${data?.id}`,
				{
					method: 'DELETE',
					headers: {
						authorization: `Bearer ${Cookies.get('token')}`,
					},
				}
			)
			if (res.data) {
				DeleteFirebaseImage(`images/blog/${user?.id}/${data?.uuid}/image_1`)
				toast.success('Deleted')
				setDeleted(true)
			}
		} catch (error) {
			toast.error('Error, please try again')
			console.log('ERROR --', error)
			return Promise.reject(error)
		}
	}

	if (deleted) {
		return null
	}

	return (
		<div className="col-sm-12 col-md-6">
			<div className="card">
				<div className="card-header">
					<h5>{data?.title}</h5>
				</div>
				<div className="card-body">
					<p>{data?.description}</p>
				</div>
				<ButtonGroup aria-label="Basic example">
					<Button variant="primary">Edit</Button>
					<Button variant="danger" onClick={deletePost}>
						Delete
					</Button>
				</ButtonGroup>
			</div>
		</div>
	)
}

export default function BlogList() {
	const [list, setList] = useState([])

	const getAllBlogs = useCallback(async () => {
		try {
			const res = await axios(
				process.env.REACT_APP_API_URL + `/blogs?&_start=0&_sort=created_at:DESC`
			)
			setList(res.data)
		} catch (error) {
			return Promise.reject(error)
		}
	}, [])

	useEffect(() => {
		getAllBlogs()
	}, [getAllBlogs])

	return (
		<div className="container-fluid">
			<div className="alert alert-danger">
				<h4 className="text-danger">No edit for now bro 😔</h4>
			</div>
			<div className="row">
				{list?.map((val, i) => {
					console.log(val)
					return <EachBlogPost key={`blog-${i}`} data={val} />
				})}
			</div>
		</div>
	)
}
