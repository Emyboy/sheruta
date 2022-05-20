import axios from "axios"
import Cookies from "js-cookie";

const API_URL = process.env.REACT_APP_API_URL;

export default class SubscriptionService {
    static async getAllActiveSubs() {
       const res = await axios(API_URL + `/transactions/?status=success`, {
           headers: {
               authorization: `Bearer ${Cookies.get('token')}`
           }
       })
       return res;
    }
}