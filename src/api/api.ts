const prodServer = `${window.location.origin}`;
const devServer = "http://localhost:3000";
const serverName = import.meta.env.VITE_APP_ENV == "production" ? prodServer : devServer;

import axios, { InternalAxiosRequestConfig } from "axios";

export const apiClient = axios.create({
  baseURL: serverName,
})

function handleTokenMiddlewareError(error: any) {
  return Promise.reject(error);
}

function handleTokenMiddleware(config: InternalAxiosRequestConfig<any>) {
  const token = localStorage.getItem("authToken");

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
}

apiClient.interceptors.request.use(handleTokenMiddleware, handleTokenMiddlewareError);

export async function userLogin<T>(data: T) {
  try {
    const response = await apiClient.post("/api/login", data);

    return response;
  }
  catch(error) {
    console.log("login failed");
    
    throw error;
  }
}