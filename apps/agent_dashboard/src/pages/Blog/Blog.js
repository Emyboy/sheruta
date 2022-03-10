import React from 'react'
import Layout from '../../components/Layout/Layout';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default function Blog() {

	const { blog_categories } = useSelector(state => state.view);

	return (
		<Layout pageName={'blog'}>
			<div className='alert alert-danger'>
				<h1 className='text-danger'>This is not working yet</h1>
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
						<form className="card-body">
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
											onChange={(e) => {}}
											name="productname"
											type="text"
											required
											className="text-black"
											placeholder="Make this short and SEO friendly"
										/>
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
									/>
								</div>
							</div>
							<div className="col-12">
								<div className="mb-3">
									<label for="productname">Post</label>
									<ReactQuill theme="snow" value={'if this breaks, no vex 😂😂<br /> I no sabi use am yet'} onChange={() => {}} />
								</div>
							</div>
							<div className="col-3">
								<div className="mb-3">
									<button className='btn btn-primary mt-5 w-100'>Create Post</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</Layout>
	)
}
