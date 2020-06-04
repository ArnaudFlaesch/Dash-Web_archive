import axios from 'axios';

const headers = {
    'Content-type': 'application/json'
};

export function addTab(label: string) {
	return axios.post(`${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/tab/addTab`, { "label": label },
		{
			headers: headers
		});
}

export function updateTab(id: number, label: any) {
	return axios.post(`${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/tab/updateTab`, { "id": id, "label": label },
		{
			headers: headers
		});
}

export function deleteTab(id: number) {
	return axios.post(`${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/tab/deleteTab`, { "id": id },
		{
			headers: headers
		});
}