import React from 'react'
import './App.css'
import MainAppRoutes from './routes/MainAppRoutes'
import { Provider } from 'react-redux'
import store from './redux/store/store'
import { ToastProvider } from 'react-toast-notifications'
import { Toaster } from 'react-hot-toast'

function App() {
	return (
		<div>
			<Provider store={store}>
				<ToastProvider>
					<Toaster />
					<MainAppRoutes />
				</ToastProvider>
			</Provider>
		</div>
	)
}

export default App
