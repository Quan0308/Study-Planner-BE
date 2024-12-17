import { HttpException } from "@nestjs/common";

import axios, { AxiosInstance } from "axios";

const api = (baseUrl: string, token = ""): AxiosInstance => {
  const api = axios.create();
  api.defaults.baseURL = baseUrl;
  if (token) api.defaults.headers.common = { Authorization: `bearer ${token}` };
  api.interceptors.response.use(
    (res) => res,
    (err) => {
      const { error } = err.response.data;
      return Promise.reject(new HttpException(error.message, error.code));
    }
  );

  return api;
};

export const genericHttpConsumer = () => {
  return api("");
};
