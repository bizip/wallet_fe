import axios from "axios";

// Create an Axios instance
const API = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`,
});

export default API;
