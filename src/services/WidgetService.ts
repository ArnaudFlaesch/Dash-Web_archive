import axios from 'axios';
import { WidgetTypes } from 'src/enums/WidgetsEnum';

export const addWidget = (type: WidgetTypes) => {
	return axios.post(`${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/widget/addWidget`, { "type": type },
		{
			headers: {
				'Content-type': 'application/json'
			}
		});
}

export const updateWidget = (id: number, data: any) => {
	return axios.post(`${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/widget/updateWidget`, { "id": id, "data": data },
		{
			headers: {
				'Content-type': 'application/json'
			}
		});
}

export const deleteWidget = (id: number) => {
	return axios.post(`${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/widget/deleteWidget`, { "id": id },
			{
				headers: {
					'Content-type': 'application/json'
				}
			});
}