import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { BsPatchCheckFill } from 'react-icons/bs'
import NINVerification from '../ServicesComponent/NINVerification'
import { BsArrowLeft } from 'react-icons/bs'

export default function VerifyProfilePopup() {
	const [step, setStep] = useState(2)
	return (
		<Modal show={true} size={'lg'}>
			<div>
				{step > 0 && (
					<button className="btn text-success" onClick={() => setStep(step -1)}>
						<BsArrowLeft size={40} />
					</button>
				)}
			</div>
			<Modal.Body className="text-center mt-5 mb-5">
				{
					[
						<div>
							<BsPatchCheckFill size={70} className="text-muted" />
							<div className="pt-3">
								<h2>Verify Your Account</h2>
								<p className="text-muted">
									Verify your account using your <strong>NIN</strong>. This will
									create trust between
									<br />
									you and our users.
								</p>
							</div>
							<button className="btn text-success mt-3 btn-lg">
								Get Started
							</button>
						</div>,
						<NINVerification />,
						<div className="mb-5">
							<h1>Congratulation</h1>
							<h5 className="text-muted mb-4">
								Your account has been successfully been verified
							</h5>
							<BsPatchCheckFill size={70} className="text-muted" />
						</div>,
					][step]
				}
			</Modal.Body>
		</Modal>
	)
}
