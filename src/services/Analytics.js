import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export default class Analytics {
  static async query(from, to, type) {
    const data = await axios(
      API_URL + `/analytics/query/${from}/${to}/${type}`
    );
    return data;
  }
}
