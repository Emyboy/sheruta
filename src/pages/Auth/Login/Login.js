import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import authBg from '../../../assets/img/auth-bg.jpg'
import Logo from '../../../assets/img/logo.png'
import NumbersHelper from '../../../helpers/Numbers'
import { loginAgent } from '../../../redux/actions/auth.action'
import Qt from './Qt'

export default function Login() {
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
		<div className="auth-page">
			<div className="container-fluid p-0">
				<div className="row g-0">
					<div className="col-xxl-3 col-lg-4 col-md-5">
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
											<p className="text-muted mt-2">
												Sign in to continue to Sheruta.
											</p>
										</div>
										<form className="mt-4 pt-2" onSubmit={handleSubmit}>
											<div className={`${error && 'alert alert-danger'}`}>
												{error}
											</div>
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
															passwordInputType === 'password'
																? 'text'
																: 'password'
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
					</div>
					<div className="col-xxl-9 col-lg-8 col-md-7">
						<div
							className="auth-bg pt-md-5 p-4 d-flex"
							style={{
								backgroundImage: `url(https://picsum.photos/200/600)`,
							}}
						>
							<div className="bg-overlay"></div>
							<ul className="bg-bubbles">
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
							</ul>
							<div className="w-100 row justify-content-center align-items-end">
								<div className="col-xl-7">
									<div className="p-0 p-sm-4 px-xl-0">
										<div
											id="reviewcarouselIndicators"
											className="carousel slide pointer-event"
											data-bs-ride="carousel"
										>
											<div className="carousel-indicators auth-carousel carousel-indicators-rounded justify-content-center mb-0">
												{/* <button
													type="button"
													data-bs-target="#reviewcarouselIndicators"
													data-bs-slide-to="0"
													className=""
													aria-label="Slide 1"
												>
													<img
														src="assets/images/users/avatar-1.jpg"
														className="avatar-md img-fluid rounded-circle d-block"
														alt="..."
													/>
												</button> */}
												<button
													type="button"
													data-bs-target="#reviewcarouselIndicators"
													data-bs-slide-to="1"
													aria-label="Slide 2"
													className="active"
													aria-current="true"
												>
													<img
														src="https://media-exp1.licdn.com/dms/image/C4E03AQG5N1oZ1YmM4Q/profile-displayphoto-shrink_800_800/0/1594670746007?e=1650499200&v=beta&t=i7q0PkbgSq0XMn0K4tuPkA11s_NGn5sb3id6ChndCUI"
														className="avatar-md img-fluid rounded-circle d-block"
														alt="..."
													/>
												</button>
												{/* <button
													type="button"
													data-bs-target="#reviewcarouselIndicators"
													data-bs-slide-to="2"
													aria-label="Slide 3"
												>
													<img
														src="assets/images/users/avatar-3.jpg"
														className="avatar-md img-fluid rounded-circle d-block"
														alt="..."
													/>
												</button> */}
											</div>
											<div className="carousel-inner">
												<div className="carousel-item active">
													<div className="testi-contain text-center text-white">
														<i className="bx bxs-quote-alt-left text-success display-6"></i>
														<h4 className="mt-4 fw-medium lh-base text-white">
															{
																Qt[
																	NumbersHelper.getRandomArbitrary(0, Qt.length)
																].q
															}
														</h4>
														<div className="mt-4 pt-1 pb-5 mb-5">
															<h5 className="font-size-16 text-white">
																Ifeora Chukwuemeka
															</h5>
															<p className="mb-0 text-white-50">Co Founder</p>
														</div>
													</div>
												</div>

												<div className="carousel-item">
													<div className="testi-contain text-center text-white">
														<i className="bx bxs-quote-alt-left text-success display-6"></i>
														<h4 className="mt-4 fw-medium lh-base text-white">
															“I've learned that people will forget what you
															said, people will forget what you did, but people
															will never forget how donec in efficitur lectus,
															nec lobortis metus you made them feel.”
														</h4>
														<div className="mt-4 pt-1 pb-5 mb-5">
															<h5 className="font-size-16 text-white">
																Ilse R. Eaton
															</h5>
															<p className="mb-0 text-white-50">Manager</p>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
