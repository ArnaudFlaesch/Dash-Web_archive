import axios, { AxiosResponse } from 'axios';
import authHeader from './auth.header';

export function exportConfig(): Promise<AxiosResponse<BlobPart>> {
  return axios.get(`${process.env.REACT_APP_BACKEND_URL}/config/export`, {
    ...authHeader(),
    responseType: 'blob'
  });
}
