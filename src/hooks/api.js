import axios from "axios";

// Create an Axios instance
const API = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`,
});

export const fetchData = async (endpoint, token, method = 'GET', data = null) => {
  let loading = true;
  let error = null;
  let responseData = null;

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (method === 'GET') {
      const response = await API.get(endpoint, config);
      responseData = response.data;
    } else if (method === 'POST') {
      const response = await API.post(endpoint, data, config);
      responseData = response.data;
    } else if (method === 'DELETE') {
      const response = await API.delete(endpoint, config);
      responseData = response.data;
    } else {
      throw new Error('Unsupported method');
    }
  } catch (err) {
    error = err;
  } finally {
    loading = false;
  }

  return { data: responseData, loading, error };
};

export default API;
