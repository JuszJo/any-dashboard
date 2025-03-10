const prodServer = `${window.location.origin}`;
const devServer = "http://localhost:3000";

// const serverName = process.env.NODE_ENV == "development" ? prodServer : (import.meta.env.VITE_APP_ENV == "production" ? prodServer : devServer);

export const serverName = process.env.NODE_ENV == "production" ? prodServer : devServer;

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

export const apiClient = axios.create({
  baseURL: serverName,
})

async function handleTokenMiddlewareError(error: AxiosError) {
  const originalRequest = error.config as InternalAxiosRequestConfig<any>; 

  if(error.response) {
    const responseData = error.response.data as any;  
  
    if (responseData.error && responseData.error === "expired") {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
  
        if (!refreshToken) {
          throw Error("No refresh token available");
        }
  
        const { data } = await axios.post(`${serverName}/api/auth/refresh`, {
          refreshToken,
        });
  
        localStorage.setItem("accessToken", data.accessToken);
  
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
  
        return apiClient(originalRequest);
      }
      catch (refreshError) {
        console.error("Refresh token request failed", refreshError);
  
        return Promise.reject(refreshError);
      }
    }
    else {
      return Promise.reject(error);
    }
  }
  else {
    return Promise.reject(error);
  }
}

function handleRequestTokenMiddleware(config: InternalAxiosRequestConfig<any>) {
  const token = localStorage.getItem("accessToken");

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
}

function handleResponseTokenMiddleware(value: AxiosResponse<any, any>) {
  if (value.data.accessToken) {
    const accessToken = value.data.accessToken;

    localStorage.setItem("accessToken", accessToken);
  }

  if (value.data.refreshToken) {
    const refreshToken = value.data.refreshToken;

    localStorage.setItem("refreshToken", refreshToken);
  }

  return value;
}

apiClient.interceptors.request.use(handleRequestTokenMiddleware, handleTokenMiddlewareError);

apiClient.interceptors.response.use(handleResponseTokenMiddleware, handleTokenMiddlewareError);

export async function userAuth() {
  try {
    const response = await apiClient.get("/api/auth");

    return response;
  }
  catch (error) {
    console.log("auth failed");

    throw error
  }
}

export async function userLogin<T>(data: T) {
  try {
    const response = await apiClient.post("/api/login", data);

    return response;
  }
  catch (error) {
    console.log("login failed");

    throw error;
  }
}

export async function userSignup<T>(data: T) {
  try {
    const response = await apiClient.post("/api/signup", data);

    return response;
  }
  catch (error) {
    console.log("signup failed");

    throw error;
  }
}