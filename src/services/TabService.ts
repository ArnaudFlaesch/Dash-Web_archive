import axios, { AxiosResponse } from 'axios';
import { ITab } from '../model/Tab';

const headers = {
  'Content-type': 'application/json'
};

export function addTab(label: string): Promise<AxiosResponse<unknown>> {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/tab/addTab`,
    { label: label },
    {
      headers
    }
  );
}

export function updateTab(id: number, label: string, tabOrder: number): Promise<AxiosResponse<unknown>> {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/tab/updateTab`,
    { id: id, label: label, tabOrder: tabOrder },
    {
      headers
    }
  );
}

export function updateTabs(tabs: ITab[]): Promise<AxiosResponse<unknown>> {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/tab/updateTabs`,
    tabs,
    {
      headers
    }
  );
}

export function deleteTab(id: number): Promise<AxiosResponse<unknown>> {
  return axios.delete(
    `${process.env.REACT_APP_BACKEND_URL}/tab/deleteTab/?id=${id}`,
    {
      headers
    }
  );
}
