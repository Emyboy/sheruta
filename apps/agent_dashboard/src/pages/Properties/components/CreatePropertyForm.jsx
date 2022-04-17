/**
 * DOCUMENTATION
 */
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import MultipleImgSelector from '../../../components/MultipleImgSelector/MultipleImgSelector'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import PropertyService from '../../../services/PropertyService'
import { storage } from '../../../Firebase'
import firebase from 'firebase'
import { v4 as Uid } from 'uuid'
import { useEffect } from 'react'
import { Alert, Modal } from 'react-bootstrap'
import { Progress } from 'antd'
import { Navigate } from 'react-router-dom'
import { notification } from 'antd'
import { DeleteFirebaseImage } from '../../../services/FirebaseService'

const uid = Uid()
const img_limit = 4

export default function CreatePropertyForm({ data }) {
	const { categories, amenities, status, paymentTypes, services } = useSelector(
		(state) => state.view
	)
	const { agent } = useSelector((state) => state.auth)
	const [imageFiles, setImageFiles] = useState(data ? data?.image_urls : [])
	const [name, setName] = useState(data ? data?.name : null)
	const [bedroom, setBedroom] = useState(data ? data?.bedroom : null)
	const [bathroom, setBathroom] = useState(data ? data?.bathroom : null)
	const [toilet, setToilet] = useState(data ? data?.toilet : null)
	const [price, setPrice] = useState(data ? data?.price : null)
	const [description, setDescription] = useState(
		data ? data?.description : null
	)
	const [statu, setStatu] = useState(data ? data?.statu : null)
	const [sittingroom, setSittingRoom] = useState(
		data ? data?.sittingroom : null
	)
	let [image_urls] = useState([])
	const [google_location, setGoogleLocation] = useState(
		data ? data?.google_location : null
	)
	const [location, setLocation] = useState(data ? data?.location : null)
	const [payment_type, setPaymentType] = useState(
		data ? data?.payment_type : null
	)
	const [service, setService] = useState(data ? data?.service : null)
	const [used] = useState(true)
	const [categorie, setCategorie] = useState(data ? data?.categorie : null)
	const [_amenities, setAmenities] = useState(
		data ? data?.amenities.map((x) => x?.id) : []
	)
	const [legal_fee, setLegalFee] = useState(data ? data?.legal_fee : null)
	const [agency_fee, setAgencyFee] = useState(data ? data?.agency_fee : null)
	const [caution_fee, setCautionFee] = useState(data ? data?.caution_fee : null)
	const [loading, setLoading] = useState(false)
	const [progress, setProgress] = useState(0)
	const [showModal, setShowModal] = useState(false)
	const [message, setMessage] = useState(null)
	const [done, setDone] = useState(false)

	const sendToDB = async (e) => {
		setMessage('Submitting..')
		setLoading(true)
		let _data = {
			name,
			bedroom,
			bathroom,
			toilet,
			price,
			description,
			statu,
			sittingroom,
			image_urls,
			google_location,
			location,
			payment_type,
			service,
			used,
			categorie,
			// state,
			amenities: _amenities,
			legal_fee,
			agency_fee,
			caution_fee,
			uid: data ? data.uid : uid,
			agent: agent.id,
			state: agent?.state,
			country: agent?.country,
			location_keyword: agent?.location_keyword
		}
		try {
			const res = data
				? await PropertyService.updateProperty(_data, data?.id)
				: await PropertyService.uploadProperty(_data)
			setLoading(false)
			setMessage('Property has been submitted')
			setTimeout(() => {
				setShowModal(false)
				setDone(true)
			}, 4000)
		} catch (error) {
			image_urls.map((_, i) => {
				DeleteFirebaseImage(`images/properties/${agent.id}/${uid}/image_${i}`)
			})
			setLoading(false)
			setMessage('There was an error, please try again')
			setTimeout(() => {
				setShowModal(false)
			}, 4000)
			console.log(error)
			return Promise.reject(error)
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		if (imageFiles.length !== img_limit) {
			notification.error({ message: `Please add ${img_limit} images` })
			return
		}
		if (!categorie) {
			notification.error({ message: `Please select a type` })
			return
		}
		if (!statu) {
			notification.error({ message: `Please select a status` })
			return
		}
		if (!payment_type) {
			notification.error({ message: `Please select a payment type` })
			return
		}
		if (!service) {
			notification.error({ message: `Please select a service` })
			return
		}
		if (_amenities.length === 0) {
			notification.error({ message: `Please select a at least one amenities` })
			return
		}

		setMessage('Uploading Image')
		setLoading(true)
		setShowModal(true)

		if (image_urls.length === img_limit) {
			sendToDB()
		}
		imageFiles
			?.filter((x) => typeof x !== 'string')
			?.map((file, i) => {
				var uploadTask = storage
					.child(
						`images/properties/${agent.id}/${data ? data?.uid : uid}/image_${i}`
					)
					.put(file)
				uploadTask.on(
					'state_changed',
					(snapshot) => {
						var progress = Math.floor(
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100
						)
						// console.log('Upload is ' + progress + '% done')
						setProgress(progress)
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
						console.log('ERROR UPLOADING --', error)
						image_urls.map((_, i) => {
							DeleteFirebaseImage(
								`images/properties/${agent.id}/${uid}/image_${i}`
							)
						})
					},
					() => {
						// Handle successful uploads on complete
						// For instance, get the download URL: https://firebasestorage.googleapis.com/...
						uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
							image_urls.push(downloadURL)
							// image_urls.splice(i, 1);
							if (data) {
								// setImageFiles([...imageFiles, downloadURL]);
								if (imageFiles.length === img_limit) {
									sendToDB()
								}
							} else {
								if (image_urls.length === img_limit) {
									sendToDB()
								}
							}
						})
					}
				)
			})
	}

	const handleUpdate = (e) => {
		e.preventDefault()
		image_urls = imageFiles?.filter((x) => typeof x === 'string')
		handleSubmit(e)
	}

	useEffect(() => {
		if (image_urls.length === img_limit) {
			sendToDB()
		}
	}, [image_urls])

	if (done) {
		return <Navigate to="/properties" />
	}

	return (
		<div className="row">
			<Modal
				show={showModal}
				// onHide={() => setShowModal(false)}
				style={{ paddingTop: '30vh' }}
			>
				<div className="modal-content">
					<div className="modal-body text-center mb-4">
						<h3 className=" mt-2 mb-5">{message}</h3>
						<Progress
							type="circle"
							percent={progress}
							format={() => 'Done'}
							strokeColor={'#74d65b'}
						/>
					</div>
				</div>
			</Modal>
			<div className="col-12">
				<div className="card">
					<div className="card-header">
						<h2 className="card-title">
							{data ? 'Edit Property' : 'Property Information'}
						</h2>
						<p className="card-title-desc">Fill all information below</p>
					</div>
					<div className="card-body">
						<Alert variant="success" className="row justify-content-between align-items-center">
							<div className="col-md-5">
								<Alert.Heading className="text-black">Important!</Alert.Heading>
								<p>
									Your location is set to{' '}
									<strong>{agent?.location_keyword?.name}</strong> in{' '}
									<strong>{agent?.state?.name}</strong> state.
								</p>
								<p>
									Any flat you post will be under{' '}
									<strong>{agent?.location_keyword?.name}</strong> automatically
								</p>
							</div>
							<div className='col-md-2'>
								{/* //Todo - Route this to account settings */}
								<button className="btn text-success fw-bold border-success">
									Change this.
								</button>
							</div>
						</Alert>
						<form onSubmit={data ? handleUpdate : handleSubmit}>
							<div className="row">
								<div className="col-sm-6">
									<div className="mb-3">
										<label for="title">Title</label>
										<input
											required
											maxLength={90}
											id="title"
											name="title"
											type="text"
											className="form-control"
											value={name}
											placeholder="Newly built 3 bedroom flat"
											onChange={(e) => setName(e.target.value)}
										/>
									</div>
									<div className="row">
										<div className="col-md-4">
											<div className="mb-3">
												<label for="bedrooms">Bedrooms</label>
												<input
													required
													id="bedroom"
													name="bedroom"
													type="number"
													className="form-control"
													value={bedroom}
													onChange={(e) => setBedroom(parseInt(e.target.value))}
												/>
											</div>
										</div>
										<div className="col-md-4">
											<div className="mb-3">
												<label for="sittingroom">Sitting Rooms</label>
												<input
													required
													id="sittingroom"
													name="sittingroom"
													type="number"
													className="form-control"
													value={sittingroom}
													onChange={(e) =>
														setSittingRoom(parseInt(e.target.value))
													}
												/>
											</div>
										</div>
										<div className="col-md-4">
											<div className="mb-3">
												<label for="toilet">Toilets</label>
												<input
													required
													id="toilet"
													name="toilet"
													type="number"
													className="form-control"
													value={toilet}
													onChange={(e) => setToilet(parseInt(e.target.value))}
												/>
											</div>
										</div>
										<div className="col-md-4">
											<div className="mb-3">
												<label for="bathroom">Bathrooms</label>
												<input
													required
													id="bathroom"
													name="bathroom"
													type="number"
													className="form-control"
													value={bathroom}
													onChange={(e) =>
														setBathroom(parseInt(e.target.value))
													}
												/>
											</div>
										</div>
									</div>
									<label className="text-muted">Location</label>
									<hr className="mt-1" />
									<div className="row">
										<div className="col-md-12">
											<div className="mb-3">
												<label for="bathrooms">Area</label>
												<GooglePlacesAutocomplete
													apiKey={process.env.REACT_APP_GOOGLE_PLACES_API_KEY}
													apiOptions={{
														language: 'en',
														region: 'ng',
													}}
													selectProps={{
														// props.state.location,
														className: 'border text-black',
														onChange: (e) => {
															setLocation(e.label)
															setGoogleLocation(e)
														},
														placeholder: 'Eg: Yaba, Lekki, Surulere',
													}}
													autocompletionRequest={{
														componentRestrictions: {
															country: ['ng'],
														},
													}}
												/>
											</div>
										</div>
									</div>
									<label className="text-muted">Money Part</label>
									<hr className="mt-1" />
									<div className="row">
										<div className="col-md-6">
											<div className="mb-3">
												<label for="bathrooms">Rent</label>
												<input
													required
													id="price"
													name="price"
													type="number"
													className="form-control"
													value={price}
													onChange={(e) => setPrice(parseInt(e.target.value))}
												/>
											</div>
										</div>
										<div className="col-md-6">
											<div className="mb-3">
												<label for="bathrooms">Agency Fee</label>
												<input
													required
													id="price"
													name="price"
													type="number"
													className="form-control"
													value={agency_fee}
													onChange={(e) =>
														setAgencyFee(parseInt(e.target.value))
													}
												/>
											</div>
										</div>
										<div className="col-md-6">
											<div className="mb-3">
												<label for="bathrooms">Caution Fee</label>
												<input
													required
													id="price"
													name="price"
													type="number"
													className="form-control"
													value={caution_fee}
													onChange={(e) =>
														setCautionFee(parseInt(e.target.value))
													}
												/>
											</div>
										</div>
										<div className="col-md-6">
											<div className="mb-3">
												<label for="bathrooms">Legal Fee</label>
												<input
													required
													id="price"
													name="price"
													type="number"
													className="form-control"
													value={legal_fee}
													onChange={(e) =>
														setLegalFee(parseInt(e.target.value))
													}
												/>
											</div>
										</div>
									</div>
								</div>

								<div className="col-sm-6">
									<div className="mb-3">
										<label className="control-label">Type</label>
										<div className="card-body p-0  pb-2">
											<div className="d-flex flex-wrap gap-2">
												{categories.map((val) => {
													return (
														<button
															type="button"
															disabled={loading}
															onClick={() => setCategorie(val)}
															className={`btn ${
																categorie?.id === val?.id
																	? 'btn-primary'
																	: 'border-primary'
															}  waves-effect waves-light`}
														>
															{val?.name}
														</button>
													)
												})}
											</div>
										</div>
									</div>

									<div className="mb-3">
										<label className="control-label">Status</label>
										<div className="card-body p-0  pb-2">
											<div className="d-flex flex-wrap gap-2">
												{status.map((val) => {
													return (
														<button
															type="button"
															disabled={loading}
															onClick={() => setStatu(val)}
															className={`btn ${
																statu?.id === val?.id
																	? 'btn-primary'
																	: 'border-primary'
															}  waves-effect waves-light`}
														>
															{val?.name}
														</button>
													)
												})}
											</div>
										</div>
									</div>
									<div className="mb-3">
										<label className="control-label">Payment Type</label>
										<div className="card-body p-0  pb-2">
											<div className="d-flex flex-wrap gap-2">
												{paymentTypes.map((val) => {
													return (
														<button
															type="button"
															disabled={loading}
															onClick={() => setPaymentType(val)}
															className={`btn ${
																payment_type?.id === val?.id
																	? 'btn-primary'
																	: 'border-primary'
															}  waves-effect waves-light`}
														>
															{val?.name}
														</button>
													)
												})}
											</div>
										</div>
									</div>
									<div className="mb-3">
										<label className="control-label">Service</label>
										<div className="card-body p-0  pb-2">
											<div className="d-flex flex-wrap gap-2">
												{services.map((val) => {
													return (
														<button
															type="button"
															disabled={loading}
															onClick={() => setService(val)}
															className={`btn ${
																service?.id === val?.id
																	? 'btn-primary'
																	: 'border-primary'
															}  waves-effect waves-light`}
														>
															{val?.name}
														</button>
													)
												})}
											</div>
										</div>
									</div>
									<div className="mb-3">
										<label className="control-label">
											Amenities (Select multiple)
										</label>
										<div className="card-body p-0  pb-2">
											<div className="d-flex flex-wrap gap-2">
												{amenities.map((val) => {
													return (
														<button
															type="button"
															disabled={loading}
															onClick={() => {
																if (_amenities.includes(val?.id)) {
																	setAmenities(
																		_amenities?.filter((x) => x !== val?.id)
																	)
																} else {
																	setAmenities([..._amenities, val?.id])
																}
															}}
															className={`btn ${
																_amenities.includes(val?.id)
																	? 'btn-primary'
																	: 'border-primary'
															}  waves-effect waves-light`}
														>
															{val?.name}
														</button>
													)
												})}
											</div>
										</div>
									</div>
									<div className="mb-3">
										<label for="productdesc">
											Tell us about this apartment
										</label>
										<textarea
											className="form-control"
											required
											disabled={loading}
											id="productdesc"
											maxLength={490}
											rows="7"
											showCount
											value={description}
											onChange={(e) => setDescription(e.target.value)}
										/>
									</div>
								</div>
							</div>
							<label className="mt-3">Images ({img_limit} images)</label>
							<hr className="mt-1" />
							<MultipleImgSelector
								limit={img_limit}
								files={imageFiles}
								onChange={(e) => setImageFiles([...imageFiles, e])}
								removeFile={(e) => {
									setImageFiles(imageFiles?.filter((x) => x !== e))
								}}
								uid={data ? data?.uid : uid}
							/>
							<hr />
							<div className="d-flex flex-wrap gap-2">
								<button
									type="submit"
									className="btn btn-primary waves-effect waves-light btn-lg"
								>
									{data ? 'Update' : 'Upload'}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}
