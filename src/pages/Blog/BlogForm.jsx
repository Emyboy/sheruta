import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import Select from 'react-select'
import { useSelector } from 'react-redux'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { DeleteFirebaseImage } from '../../services/FirebaseService'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import Cookies from 'js-cookie'
import { storage } from '../../Firebase'
import firebase from 'firebase'
import { notification } from 'antd'
import toast from 'react-hot-toast'

const uuid = uuidv4()

export default function BlogForm() {
	const { blog_categories } = useSelector((state) => state.view)
	const { user } = useSelector((state) => state.auth)

	const [title, setTitle] = useState('')
	const [description, setDescription] = useState(null)
	const [categorie, setCategroie] = useState(null)
	const [sub_categories, setSubCategories] = useState([])
	const [body, setBody] = useState(null)

	const [imageFile, setImageFile] = useState(null)

	const sendToDb = async (image_url) => {
		const data = {
			title,
			body,
			description,
			author: user?.id,
			image_url,
			blog_categorie: categorie.value,
			sub_categories: sub_categories.map((val) => {
				return val.value
			}),
			slug: title.replace(/\s/g, '-').toLowerCase(),
			uuid
		}
		console.log(data)

		try {
			const res = await axios(process.env.REACT_APP_API_URL + `/blogs`, {
				method: 'POST',
				data,
				headers: {
					Authorization: `Bearer ${Cookies.get('token')}`,
				},
			})
			console.log(res.data)
			if (res.data) {
				notification.success({ message: 'Post Added ' })
			}
		} catch (error) {
			console.log(error)
			return Promise.reject(error)
		}
	}

	const uploadImage = async () => {
		if (!title) {
			return notification.error({ message: 'Title is missing' })
		}
		if (!categorie) {
			return notification.error({ message: 'Category is missing' })
		}
		if (!sub_categories.length === 0) {
			return notification.error({ message: 'Sub category is missing' })
		}
		if (!imageFile) {
			return notification.error({ message: 'Please add one image' })
		}
		if (!description) {
			return notification.error({ message: 'Please add description' })
		}
		if (!body) {
			return notification.error({ message: 'Please add post body' })
		}
        toast.success("Loading...")
		const directory = `images/blog/${user?.id}/${uuid}/image_1`
		var uploadTask = storage.child(directory).put(imageFile)
		uploadTask.on(
			'state_changed',
			(snapshot) => {
				var progress = Math.floor(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				)
				// console.log('Upload is ' + progress + '% done')
				switch (snapshot.state) {
					case firebase.storage.TaskState.PAUSED: // or 'paused'
						console.log('Upload is paused')
						break
					case firebase.storage.TaskState.RUNNING: // or 'running'
						console.log('Upload is running')
						break
					default:
						break
				}
			},
			(error) => {
				// Handle unsuccessful uploads
				DeleteFirebaseImage(directory)
			},
			() => {
				// Handle successful uploads on complete
				// For instance, get the download URL: https://firebasestorage.googleapis.com/...
				uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
					sendToDb(downloadURL)
				})
			}
		)
	}

	return (
		<section>
			<div className="alert alert-danger">
				<h1 className="text-danger">Please Select an image twice,</h1>
				<h6 className="text-danger">Small bug dey the image selection 😥😥</h6>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="page-title-box d-sm-flex align-items-center justify-content-between">
							<h4 className="mb-sm-0 font-size-18">Blogs</h4>

							<div className="page-title-right">
								<ol className="breadcrumb m-0">
									<li className="breadcrumb-item">
										<a href="javascript: void(0);">Email</a>
									</li>
									<li className="breadcrumb-item active">Inbox</li>
								</ol>
							</div>
						</div>
					</div>
				</div>
				<div className="row justify-content-center">
					<div className="card">
						<div className="card-body">
							<div className="row">
								<div className="col-6">
									<div className="mb-3">
										<label for="productname">Post Title</label>
										<input
											id="productname"
											name="productname"
											type="text"
											required
											className="form-control"
											placeholder="Make this short and SEO friendly"
											onChange={(e) => setTitle(e.target.value)}
										/>
									</div>
								</div>
								<div className="col-6">
									<div className="mb-3">
										<label for="productname">Post Category</label>
										<Select
											options={
												blog_categories
													? blog_categories?.map((val) => ({
															value: val?.id,
															label: val?.name,
													  }))
													: []
											}
											id="productname"
											onChange={(e) => {
												setCategroie(e)
											}}
											name="productname"
											type="text"
											required
											className="text-black"
											placeholder="Make this short and SEO friendly"
										/>
									</div>
								</div>

								<div className="col-12">
									<div className="mb-3">
										<label for="productname">Sub Categories</label>
										<Select
											options={
												blog_categories
													? blog_categories?.map((val) => ({
															value: val?.id,
															label: val?.name,
													  }))
													: []
											}
											id="productname"
											onChange={(e) => {
												setSubCategories(e)
											}}
											name="productname"
											type="text"
											required
											isMulti
											className="text-black"
											placeholder="Make this short and SEO friendly"
										/>
									</div>
								</div>

								<div className="card">
									<div className="card-header">
										<h4 className="card-title mb-0">Post Images</h4>
									</div>
									<div className="card-body">
										<input
											type="file"
											id="actual-btn"
											hidden
											onClick={(e) => setImageFile(e.target.files[0])}
										/>
										<label
											className="dropzone dz-clickable w-100"
											htmlFor="actual-btn"
										>
											<div className="dz-message needsclick text-center pt-5">
												<div className="mb-3">
													<i className="display-4 text-muted bx bxs-cloud-upload"></i>
												</div>

												{!imageFile ? (
													<h4>Drop files here or click to upload.</h4>
												) : (
													<div>
														<h6 className="text-success">Image Added</h6>
														<h4>Click here to change</h4>
													</div>
												)}
											</div>
										</label>
									</div>
								</div>
							</div>
							<div className="col-12">
								<div className="mb-3">
									<label for="productname">Post Description</label>
									<textarea
										id="productname"
										name="productname"
										type="text"
										className="form-control"
										placeholder="Make this short and SEO friendly"
										required
										rows={6}
										onChange={(e) => setDescription(e.target.value)}
										maxLength="130"
									/>
								</div>
							</div>
							<div className="col-12">
								<div className="mb-3">
									<label for="productname">Post</label>
									<ReactQuill
										theme="snow"
										value={body}
										onChange={(e) => setBody(e)}
									/>
								</div>
							</div>
							<div className="col-3">
								<div className="mb-3">
									<button
										className="btn btn-primary mt-5 w-100"
										onClick={uploadImage}
									>
										Create Post
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
