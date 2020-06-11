import axios from 'axios';

const headers = {
    'Content-type': 'application/json'
};

export function addTab(label: string) {
	return axios.post(`${process.env.REACT_APP_BACKEND_URL}/tab/addTab`, { "label": label },
		{
			headers
		});
}

export function updateTab(id: number, label: any) {
	return axios.post(`${process.env.REACT_APP_BACKEND_URL}/tab/updateTab`, { "id": id, "label": label },
		{
			headers
		});
}

export function deleteTab(id: number) {
	return axios.delete(`${process.env.REACT_APP_BACKEND_URL}/tab/deleteTab/?id=${id}`,
		{
			headers
		});
}