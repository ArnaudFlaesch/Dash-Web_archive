import axios from 'axios';
import { WidgetTypes } from '../enums/WidgetsEnum';

const headers = {
    'Content-type': 'application/json'
};


export function addWidget(type: WidgetTypes) {
	return axios.post(`${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/widget/addWidget`, { "type": type },
		{
			headers
		});
}

export function updateWidget(id: number, data: any) {
	return axios.post(`${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/widget/updateWidget`, { "id": id, "data": data },
		{
			headers
		});
}

export function deleteWidget(id: number) {
	return axios.post(`${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/widget/deleteWidget`, { "id": id },
		{
			headers
		});
}