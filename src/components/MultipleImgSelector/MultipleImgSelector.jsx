import React, { memo, useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { FaTrash } from 'react-icons/fa'
import { DeleteFirebaseImage } from '../../services/FirebaseService'
import { useSelector } from 'react-redux'
import { notification, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin color="white" />

export const ImageSelector = memo(
	({ file, onChange, removeFile, disabled, uid, files }) => {
		const { agent } = useSelector((state) => state.auth)
		const [deleteLoading, setDeleteLoading] = useState(false)

		const handleDelete = async () => {
			if (typeof file === 'string') {
				setDeleteLoading(true)
				const res = await DeleteFirebaseImage(
					`images/properties/${agent.id}/${uid}/image_${files?.indexOf(file)}`
				)
				if (res?.name === 'FirebaseError') {
					notification.error({ message: 'Error deleting image' })
					setDeleteLoading(false)
				} else {
					setDeleteLoading(false)
					removeFile(file)
				}
			} else removeFile(file)
		}

		return (
			<div className="mb-4">
				<label
					htmlFor={uid || 'new-file'}
					className="btn border-primary p-2 border form-control d-flex justify-content-center shadow mb-2"
					style={{
						height: '250px',
						borderRadius: '10px',
						backgroundImage: `url(${
							typeof file === 'string'
								? file
								: file
								? URL.createObjectURL(file)
								: ''
						})`,
						backgroundPosition: 'center',
						backgroundSize: 'cover',
					}}
				>
					{!disabled ? (
						<>
							<input
								type="file"
								id={uid || 'new-file'}
								hidden
								onChange={(e) => onChange(e.target.files)}
							/>
							<div className="align-self-center">
								<IoMdAdd size={30} className="mb-2" />
								<br />
								<h6>Add Image</h6>
							</div>
						</>
					) : null}
				</label>
				{file && (
					<div className="d-flex justify-content-center" onClick={handleDelete}>
						<button className="btn btn-sm btn-danger" disabled={deleteLoading}>
							{deleteLoading ? (
								<Spin indicator={antIcon} style={{ color: 'white'}} />
							) : (
								<>
									<FaTrash /> Delete
								</>
							)}
						</button>
					</div>
				)}
			</div>
		)
	}
)

export default function MultipleImgSelector({
	limit,
	urls,
	files,
	onChange,
	removeFile,
	uid,
}) {
	return (
		<div className="row mb-5">
			<div className="col-12">
				<div className="row">
					{files.map((val, i) => {
						return (
							<div className="col-6 col-sm-4 col-lg-2" key={`img-${i}`}>
								<ImageSelector
									file={val}
									onChange={() => {}}
									removeFile={(e) => removeFile(e)}
									disabled
									uid={uid}
									files={files}
								/>
							</div>
						)
					})}
					{files.length <= limit - 1 && (
						<div className="col-6 col-sm-4 col-lg-2">
							<ImageSelector onChange={(e) => onChange(e[0])} />
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
