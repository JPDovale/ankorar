import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
import { type Response } from "./responses";

export const URL = import.meta.env.VITE_ANKORAR_API_URL ?? "http://localhost:9090";
export const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT;

const apiConfig: AxiosInstance = axios.create({
  baseURL: URL,
  withCredentials: true,
});

apiConfig.interceptors.response.use(
  (res) => {
    const { data: dataRes, ...restRes } = res;
    const { data, ...restDataRes } = dataRes;

    return Promise.resolve({
      ...restRes,
      data: {
        ...data,
        ...restDataRes,
      },
    });
  },
  (error) => {
    if (error.response && error.response.data) {
      return Promise.resolve({
        ...error.response.data,
        status: error.response.status,
      });
    }

    const err = {
      message: "Não foi possível se conectar com o servidor!",
      status: 500,
    };
    return Promise.resolve(err);
  },
);

const connection = {
  setDefaultBearerToken: (token: string) => {
    apiConfig.defaults.headers.Authorization = `Bearer ${token}`;
  },

  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiConfig.get<unknown, Response<T, AxiosHeaders>>(url, config),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiConfig.post<unknown, Response<T, AxiosHeaders>>(url, data, config),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiConfig.put<unknown, Response<T, AxiosHeaders>>(url, data, config),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiConfig.patch<unknown, Response<T, AxiosHeaders>>(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiConfig.delete<unknown, Response<T, AxiosHeaders>>(url, config),
};

export { apiConfig, connection };
