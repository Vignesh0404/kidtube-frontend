import axios from "axios";

axios.defaults.withCredentials = true;


export const axiosInstance = axios.create({
  baseURL: "https://kidtube-server.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
