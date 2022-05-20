import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import EachUserCard from './EachUserCard'
import Select from 'react-select'

export default function Users() {
	const initialQuery = '/?confirmed=true'
	const [users, setUsers] = useState([])
	const [query, setQuery] = useState(initialQuery)
	const [queryType, setQueryType] = useState(null)
	const [keyword, setKeyword] = useState(null)

	const getUsers = useCallback(() => {
		axios(
			process.env.REACT_APP_API_URL +
				`/users${query}&_start=0&_sort=created_at:DESC`
		)
			.then((res) => {
				setUsers(res.data)
				// console.log(res.data)
			})
			.catch((err) => {
				console.log(err)
			})
	}, [query])

	useEffect(() => {
		getUsers()
	}, [getUsers])

	useEffect(() => {
		switch (queryType) {
			case 'email':
				setQuery(`/?email=${keyword}`)
				break
			case 'id':
				setQuery(`/?id=${keyword}`)
				break
			case 'username':
				setQuery(`/?username=${keyword}`)
				break

			default:
				setQuery(initialQuery)
		}
	}, [keyword, queryType])

	useEffect(() => {
		if (keyword) {
			getUsers()
		}else {
			setQueryType(null)
			setQuery(initialQuery)
			getUsers();
		}
	}, [getUsers, keyword])

	// useEffect(() => {
	// 	getUsers()
	// }, [query, getUsers])

	return (
		<Layout pageName="users">
			<div className="container-fluid mt-4">
				<div className="card p-2">
					<div className="row justify-content-between">
						<div className="col-sm-7">
							<div className="search-box me-2 mb-2 d-inline-block w-100">
								<div className="position-relative">
									<input
										type="text"
										className="form-control"
										placeholder="Search..."
										onChange={(e) => setKeyword(e.target.value)}
									/>
									<i className="bx bx-search-alt search-icon"></i>
								</div>
							</div>
						</div>
						<div className="col-sm-4">
							<div className="text-sm-end">
								<Select
									options={[
										{ label: 'By Email', value: 'email' },
										{ label: 'By Username', value: 'username' },
										{ label: 'By ID', value: 'id' },
									]}
									placeholder="Search By"
									onChange={(e) => setQueryType(e.value)}
								/>
								{/* <select className="form-control">
									<option onClick={() => setQueryType('email')}>
										By Email
									</option>
									<option onClick={() => setQueryType('id')}>By ID</option>
									<option onClick={() => setQueryType('username')}>
										By Username
									</option>
								</select> */}
							</div>
						</div>
					</div>
				</div>

				<div className="row">
					{users.map((val, i) => {
						return (
							<div className="col-xl-3 col-sm-6 col-md-6">
								<EachUserCard key={val.id} user={val} />
							</div>
						)
					})}
				</div>
			</div>
		</Layout>
	)
}
