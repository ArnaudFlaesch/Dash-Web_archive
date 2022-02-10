import axios, { AxiosResponse } from 'axios';
import { IWidgetConfig } from 'src/widgets/IWidgetConfig';
import authorizationBearer from './auth.header';

export function getWidgets(tabId: number): Promise<AxiosResponse<IWidgetConfig[]>> {
  return axios.get(`${process.env.REACT_APP_BACKEND_URL}/widget/?tabId=${tabId}`, {
    headers: {
      Authorization: authorizationBearer(),
      'Content-type': 'application/json'
    }
  });
}

export function addWidget(type: string, tabId: number): Promise<AxiosResponse<unknown>> {
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

export function updateWidgetData(id: number, data: unknown): Promise<AxiosResponse<IWidgetConfig>> {
  return axios.patch(
    `${process.env.REACT_APP_BACKEND_URL}/widget/updateWidgetData/${id}`,
    { data: data },
    {
      headers: {
        Authorization: authorizationBearer(),
        'Content-type': 'application/json'
      }
    }
  );
}

export function deleteWidget(id: number): Promise<AxiosResponse<unknown>> {
  return axios.delete(`${process.env.REACT_APP_BACKEND_URL}/widget/deleteWidget/?id=${id}`, {
    headers: {
      Authorization: authorizationBearer(),
      'Content-type': 'application/json'
    }
  });
}
