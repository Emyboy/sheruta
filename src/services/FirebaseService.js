import { storage } from '../Firebase'
export const DeleteFirebaseImage = async (firebaseRef) => {
	// Create a reference to the file to delete
	console.log('CALLED')
	var desertRef = storage.child(firebaseRef)

	// Delete the file
	const deleted = await desertRef
		.delete()
		.then(() => {
			// File deleted successfully
			console.log('IMAGE DELETED')
		})
		.catch((error) => {
			// Uh-oh, an error occurred!
			console.log('IMAGE DELETED ERROR == ', error)
			return error
		})
	return deleted
}
