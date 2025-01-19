import axios from "axios";
import { AuthProvider } from "../context/AuthContext";
import { useAuth } from "./useAuth";

// Create an Axios instance
const API = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`,
});

export const fetchData = async (endpoint, token) => {
  let loading = true;
  let error = null;
  let data = null;

  try {
    const response = await API.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    data = response.data;
  } catch (err) {
    error = err;
  } finally {
    loading = false;
  }

  return { data, loading, error };
};

export default API;
