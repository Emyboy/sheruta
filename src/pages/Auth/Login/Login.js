import React, { useEffect, useState } from 'react'
import NumbersHelper from '../../../helpers/Numbers'
import LoginForm from './LoginForm'
import Qt from './Qt'

export default function Login() {
	return (
		<div className="auth-page">
			<div className="container-fluid p-0">
				<div className="row g-0">
					<div className="col-xxl-3 col-lg-4 col-md-5">
						<LoginForm />
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
