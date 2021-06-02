import axios, { AxiosResponse } from 'axios';
import authorizationBearer from './auth.header';

export function addWidget(
  type: string,
  tabId: number
): Promise<AxiosResponse<unknown>> {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/widget/addWidget`,
    { type: type, tab: { id: tabId } },
    {
      headers: {
        Authorization: authorizationBearer(),
        'Content-type': 'application/json'
      }
    }
  );
}

export function updateWidgetData(
  id: number,
  data: unknown
): Promise<AxiosResponse<unknown>> {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/widget/updateWidgetData`,
    { id: id, data: data },
    {
      headers: {
        Authorization: authorizationBearer(),
        'Content-type': 'application/json'
      }
    }
  );
}

export function deleteWidget(id: number): Promise<AxiosResponse<unknown>> {
  return axios.delete(
    `${process.env.REACT_APP_BACKEND_URL}/widget/deleteWidget/?id=${id}`,
    {
      headers: {
        Authorization: authorizationBearer(),
        'Content-type': 'application/json'
      }
    }
  );
}
