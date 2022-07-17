import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import authBg from '../../../assets/img/auth-bg.jpg'
import Logo from '../../../assets/img/logo.png'
import NumbersHelper from '../../../helpers/Numbers'
import { loginAgent } from '../../../redux/actions/auth.action'
import Qt from './Qt'

export default function LoginForm() {
	const dispatch = useDispatch()
	const { loading, error } = useSelector((state) => state.auth)
	const [data, setData] = useState({
		password: null,
		identifier: null,
	})
	const [passwordInputType, setPasswordInputType] = useState('password')

	const handleSubmit = (e) => {
		e.preventDefault()

		dispatch(loginAgent(data))
	}

	useEffect(() => {
		if (error) {
			setTimeout(() => {
				dispatch({
					type: 'SET_AUTH_STATE',
					payload: {
						error: null,
					},
				})
			}, 5000)
		}
	}, [error])

	useEffect(() => {
		console.log('THE NUMBER --', NumbersHelper.getRandomArbitrary(1, 4))
	}, [])
	return (
		<div className="auth-full-page-content d-flex p-sm-5 p-4">
			<div className="w-100">
				<div className="d-flex flex-column h-100">
					<div className="mb-4 mb-md-5 text-center">
						<a href="#c" className="d-block auth-logo">
							<img src={Logo} alt="" height="28" />{' '}
							<span className="logo-txt">Sheruta</span>
						</a>
					</div>
					<div className="auth-content my-auto">
						<div className="text-center">
							<h5 className="mb-0">Login</h5>
							<p className="text-muted mt-2">Sign in to continue to Sheruta.</p>
						</div>
						<form className="mt-4 pt-2" onSubmit={handleSubmit}>
							<div className={`${error && 'alert alert-danger'}`}>{error}</div>
							<div className="form-floating form-floating-custom mb-4">
								<input
									type="email"
									className="form-control"
									id="input-email"
									placeholder="Enter User Email"
									name="email"
									onChange={(e) =>
										setData({ ...data, identifier: e.target.value })
									}
								/>
								<label for="input-username">Email</label>
								<div className="form-floating-icon">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										className="feather feather-users"
									>
										<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
										<circle cx="9" cy="7" r="4"></circle>
										<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
										<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
									</svg>
								</div>
							</div>

							<div className="form-floating form-floating-custom mb-4 auth-pass-inputgroup">
								<input
									type={passwordInputType}
									className="form-control pe-5"
									id="password-input"
									placeholder="Enter Password"
									onChange={(e) =>
										setData({ ...data, password: e.target.value })
									}
								/>

								<button
									onClick={() =>
										setPasswordInputType(
											passwordInputType === 'password' ? 'text' : 'password'
										)
									}
									type="button"
									className="btn btn-link position-absolute h-100 end-0 top-0"
									id="password-addon"
								>
									<i className="mdi mdi-eye-outline font-size-18 text-muted"></i>
								</button>
								<label for="input-password">Password</label>
								<div className="form-floating-icon">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										className="feather feather-lock"
									>
										<rect
											x="3"
											y="11"
											width="18"
											height="11"
											rx="2"
											ry="2"
										></rect>
										<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
									</svg>
								</div>
							</div>

							<div className="row mb-4">
								<div className="col">
									<div className="form-check font-size-15">
										<input
											className="form-check-input"
											type="checkbox"
											id="remember-check"
										/>
										<label
											className="form-check-label font-size-13"
											for="remember-check"
										>
											Remember me
										</label>
									</div>
								</div>
							</div>
							<div className="mb-3">
								<button
									className="btn btn-primary w-100 waves-effect waves-light"
									type="submit"
									disabled={loading}
								>
									{loading ? 'Loading...' : 'Login'}
								</button>
							</div>
						</form>

						{/* <div className="mt-5 text-center">
											<p className="text-muted mb-0">
												Don't have an account ?{' '}
												<a
													href="auth-register.html"
													className="text-primary fw-semibold"
												>
													{' '}
													Signup now{' '}
												</a>{' '}
											</p>
										</div> */}
					</div>
				</div>
			</div>
		</div>
	)
}
