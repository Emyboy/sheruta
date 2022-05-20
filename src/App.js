import React from 'react'
import './App.css'
import MainAppRoutes from './routes/MainAppRoutes'
import { Provider } from 'react-redux'
import store from './redux/store/store';
import { ToastProvider } from 'react-toast-notifications'

function App() {
	return (
		<div>
			<Provider store={store}>
				<ToastProvider>
					<MainAppRoutes />
				</ToastProvider>
			</Provider>
		</div>
	)
}

export default App
