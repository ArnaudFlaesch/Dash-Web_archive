import axios from 'axios';

export const updateWidget = (id: number, data: any) => {
    return axios.post(`${process.env.REACT_APP_BACKEND_URL}/db/updateWidget`, { "id": id, "data": data },
			{
				headers: {
					'Content-type': 'application/json'
				}
			})
}