import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASEURL,
});

// attach Clerk token automatically in every request
api.interceptors.request.use(async (config) => {

  if (window.Clerk) {

    const token = await window.Clerk.session?.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

  }

  return config;

});

export default api;