import axios from 'axios';
import { WidgetTypes } from '../enums/WidgetsEnum';

const headers = {
    'Content-type': 'application/json'
};


export function addWidget(type: WidgetTypes) {
	return axios.post(`${process.env.REACT_APP_BACKEND_URL}/widget/addWidget`, { "type": type },
		{
			headers
		});
}

export function updateWidgetData(id: number, data: any) {
	return axios.post(`${process.env.REACT_APP_BACKEND_URL}/widget/updateWidgetData`, { "id": id, "data": data },
		{
			headers
		});
}

export function deleteWidget(id: number) {
	return axios.delete(`${process.env.REACT_APP_BACKEND_URL}/widget/deleteWidget/?id=${id}`,
		{
			headers
		});
}