import axios from 'axios';
import { IWidgetConfig } from '../widgets/IWidgetConfig';
import { WidgetTypes } from '../enums/WidgetsEnum';
const headers = {
  'Content-type': 'application/json'
};

export function addWidget(type: WidgetTypes, tabId: number) {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/widget/addWidget`,
    { type: type, tab: { id: tabId } },
    {
      headers
    }
  );
}

export function updateWidgetData(id: number, data: any) {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/widget/updateWidgetData`,
    { id: id, data: data },
    {
      headers
    }
  );
}

export function updateWidgets(widgets: IWidgetConfig[]) {
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

export function deleteWidget(id: number) {
  return axios.delete(
    `${process.env.REACT_APP_BACKEND_URL}/widget/deleteWidget/?id=${id}`,
    {
      headers
    }
  );
}
