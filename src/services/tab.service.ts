import axios, { AxiosResponse } from 'axios';
import { ITab } from '../model/Tab';
import authHeader from './auth.header';

export function getTabs(): Promise<AxiosResponse<unknown>> {
  return axios.get(`${process.env.REACT_APP_BACKEND_URL}/tab`, authHeader());
}

export function addTab(label: string): Promise<AxiosResponse<unknown>> {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/tab/addTab`,
    { label: label },
    authHeader()
  );
}

export function updateTab(
  id: number,
  label: string,
  tabOrder: number
): Promise<AxiosResponse<unknown>> {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/tab/updateTab`,
    { id: id, label: label, tabOrder: tabOrder },
    authHeader()
  );
}

export function updateTabs(tabs: ITab[]): Promise<AxiosResponse<unknown>> {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/tab/updateTabs`,
    tabs,
    authHeader()
  );
}

export function deleteTab(id: number): Promise<AxiosResponse<unknown>> {
  return axios.delete(
    `${process.env.REACT_APP_BACKEND_URL}/tab/deleteTab/?id=${id}`,
    authHeader()
  );
}
