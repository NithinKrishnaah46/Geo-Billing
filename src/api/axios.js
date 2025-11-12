import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "https://api.example.com",
  timeout: 15000
});

export default api;
