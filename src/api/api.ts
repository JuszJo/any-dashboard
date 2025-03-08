const prodServer = `${window.location.origin}`;
const devServer = "http://localhost:3000";

// const serverName = process.env.NODE_ENV == "development" ? prodServer : (import.meta.env.VITE_APP_ENV == "production" ? prodServer : devServer);

export const serverName = process.env.NODE_ENV == "production" ? prodServer : devServer;

import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

export const apiClient = axios.create({
  baseURL: serverName,
})

function handleTokenMiddlewareError(error: any) {
  return Promise.reject(error);
}

function handleRequestTokenMiddleware(config: InternalAxiosRequestConfig<any>) {
  const token = localStorage.getItem("authToken");

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
}

function handleResponseTokenMiddleware(value: AxiosResponse<any, any>) {
  if(value.data.token) {
    const token = value.data.token;
    
    localStorage.setItem("authToken", token);
  }

  if(value.headers["authorization"]) {
    const token = value.headers["authorization"].split(" ")[1];

    localStorage.setItem("authToken", token)
  }

  return value;
}

apiClient.interceptors.request.use(handleRequestTokenMiddleware, handleTokenMiddlewareError);

apiClient.interceptors.response.use(handleResponseTokenMiddleware, handleTokenMiddlewareError)

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