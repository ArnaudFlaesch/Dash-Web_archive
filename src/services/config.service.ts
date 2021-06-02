import axios, { AxiosResponse } from 'axios';
import authorizationBearer from './auth.header';

export function exportConfig(): Promise<AxiosResponse<BlobPart>> {
  return axios.get(`${process.env.REACT_APP_BACKEND_URL}/config/export`, {
    headers: {
      Authorization: authorizationBearer(),
      'Content-type': 'application/json'
    },
    responseType: 'blob'
  });
}

export function importConfig(file: File): Promise<boolean> {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/config/import`,
    formData,
    {
      headers: {
        Authorization: authorizationBearer(),
        'content-type': 'multipart/form-data'
      }
    }
  );
}
