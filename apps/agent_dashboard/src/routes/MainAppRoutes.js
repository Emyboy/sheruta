import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'antd/dist/antd.css'
import Login from '../pages/Auth/Login/Login'

import '../ui_assets/libs/admin-resources/jquery.vectormap/jquery-jvectormap-1.2.2.css'
import '../ui_assets/css/icons.min.css'
import '../ui_assets/css/preloader.min.css'
import '../ui_assets/css/bootstrap.min.css'
import '../ui_assets/css/app.min.css'

import { useSelector } from 'react-redux'
import Home from '../pages/Home/Home'
import Logs from '../pages/Logs/Logs'
import Blog from '../pages/Blog/Blog'
import Analyticss from '../pages/Analytics/Analytics';
import Users from '../pages/Users/Users';
import Email from '../pages/Email/Email'
import Profile from '../pages/Profile/Profile'
import MasterPopup from '../components/MasterPopup/MasterPopup'
import Properties from '../pages/Properties/Properties'
import CreateProperty from '../pages/Properties/CreateProperty'
import Notifications from '../pages/Notification/Notification'
import EditProperty from '../pages/Properties/EditProperty'
import Agents from '../pages/Agents/Agents'
import Messages from '../pages/Messages/Messages'
import RedFlags from '../pages/RedFlags/RedFlags'
import Inspections from '../pages/Inspections/Inspections'

export default function MainAppRoutes() {
	const { user } = useSelector((state) => state.auth)
	return (
		<div>
			<MasterPopup />
			<BrowserRouter>
				{!user ? (
					<Routes>
						<Route path="*" element={<Login />} />
						<Route path="/login" element={<Login />} />
					</Routes>
				) : (
					<Routes>
						{user?.id === parseInt(process.env.REACT_APP_ADMIN_ID) ? (
							<>
								<Route path="/" element={<Home />} />
								<Route path="/agents" element={<Agents />} />
								<Route path="/logs" element={<Logs />} />
								<Route path="/blog" element={<Blog />} />
								<Route path="/analytics" element={<Analyticss />} />
								<Route path="/users" element={<Users />} />
								<Route path="/email" element={<Email />} />
								<Route path="/reports" element={<RedFlags />} />
							</>
						) : (
							<>
								<Route path="/" element={<Properties />} />
								<Route path="/messages" element={<Messages />} />
								<Route path="/inspections" element={<Inspections />} />
							</>
						)}
						<Route path="/properties" element={<Properties />} />
						<Route path="/properties/create" element={<CreateProperty />} />
						<Route
							path="/properties/edit/:property_id"
							element={<EditProperty />}
						/>
						<Route path="/login" element={<Login />} />
						<Route path="/notifications" element={<Notifications />} />
						<Route path="/user/:user_id" element={<Profile />} />
					</Routes>
				)}
			</BrowserRouter>
		</div>
	)
}
