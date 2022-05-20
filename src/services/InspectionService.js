import axios from 'axios'
import Cookies from 'js-cookie'

export default class InspectionService {
	static async getAllAgentInspection(agent_id) {
		const res = await axios(
			process.env.REACT_APP_API_URL +
				`/property-inspections/?agent=${agent_id}`,
			{
				headers: {
					authorization: `Bearer ${Cookies.get('token')}`,
				},
			}
		)
		return res
	}

	static async acceptOrRejectInspection(inspection_id, status, reason) {
		const res = await axios(
			process.env.REACT_APP_API_URL +
				`/property-inspections/agent/action/${status}/${reason}/${inspection_id}`, {
					method: 'POST',
					headers: {
						authorization: `Bearer ${Cookies.get('token')}`
					}
				}
		);
		return res;
	}

	static async getInspectionByID(inspection_id){
		const res = await axios(
			process.env.REACT_APP_API_URL +
				`/property-inspections/${inspection_id}`,
			{
				headers: {
					authorization: `Bearer ${Cookies.get('token')}`,
				},
			}
		)
		return res
	}
}
