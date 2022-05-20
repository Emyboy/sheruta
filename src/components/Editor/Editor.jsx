import React from 'react'
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ReactQuill from 'react-quill' // ES6
import 'react-quill/dist/quill.snow.css' // E

export default function Editor({ onChange, data }) {
	return (
		<ReactQuill
			value={data}
			onChange={onChange}
			modules={{
				toolbar: {
					container: [
						[{ header: [3, 4, false] }],
						['bold', 'italic', 'underline'],
						[{ list: 'ordered' }, { list: 'bullet' }],
						// [{ align: [] }],
						['link'],
						// ['link', 'image'],
						// ['clean'],
						// [{ color: ['black', 'blue'] }],
					],
					// handlers: {
					// 	image: () => {},
					// },
				},
			}}
		/>
	)
	// return (
	//     <CKEditor
	//         editor={ClassicEditor}
	//         data={data}
	//         onReady={editor => {
	//             // You can store the "editor" and use when it is needed.
	//             // console.log('Editor is ready to use!', editor);
	//         }}
	//         onChange={(event, editor) => {
	//             const data = editor.getData();
	//             // console.log({ event, editor, data });
	//             onChange(data, data.replace(/<[^>]*>?/gm, ''))
	//         }}
	//         onBlur={(event, editor) => {
	//             console.log('Blur.', editor);
	//         }}
	//         onFocus={(event, editor) => {
	//             console.log('Focus.', editor);
	//         }}
	//     />
	// )
}
