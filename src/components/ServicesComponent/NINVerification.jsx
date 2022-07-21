import React from 'react'

export default function NINVerification() {
	return (
		<div>
			<div>
				<h2 className='mb-4'>Enter NIN</h2>
				<input
					className="form-control form-control-lg text-center"
					type="text"
					placeholder="Ex. 12345677891"
					aria-label=".form-control-lg example"
                    maxLength={'11'}
                    style={{ fontSize: '20px' }}
				/>
			</div>
			<button className="btn text-success mt-4 btn-lg">Submit</button>
		</div>
	)
}
