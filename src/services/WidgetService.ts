import axios, { AxiosResponse } from 'axios';
import { IWidgetConfig } from '../widgets/IWidgetConfig';
const headers = {
  'Content-type': 'application/json'
};

export function addWidget(
  type: string,
  tabId: number
): Promise<AxiosResponse<unknown>> {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/widget/addWidget`,
    { type: type, tab: { id: tabId } },
    {
      headers
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
      headers
    }
  );
}

export function updateWidgets(
  widgets: IWidgetConfig[]
): Promise<AxiosResponse<unknown>> {
  const widgetsData = widgets.map((widget) => {
    return { id: widget.id, widgetOrder: widget.widgetOrder };
  });
  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/widget/updateWidgets`,
    widgetsData,
    {
      headers
    }
  );
}

export function deleteWidget(id: number): Promise<AxiosResponse<unknown>> {
  return axios.delete(
    `${process.env.REACT_APP_BACKEND_URL}/widget/deleteWidget/?id=${id}`,
    {
      headers
    }
  );
}
