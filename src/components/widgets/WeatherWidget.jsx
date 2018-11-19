import React, { Component } from 'react';

export class WeatherWidget extends Component {

	constructor(props) {
		super(props);
		this.API_KEY = props.weather_api_key;
		this.city = "Paris";
		this.CURRENT_WEATHER_API = "https://api.apixu.com/v1/current.json";
		this.FORECAST_WEATHER_API = "https://api.apixu.com/v1/forecast.json";
	}

	componentDidMount() {
		fetch(this.CURRENT_WEATHER_API + "?key=" + this.API_KEY + "?q=" + this.city)
			.then(result => {
				console.log(result);
			})
			.catch(error => {
				console.log(error);
			});
	}

	render() {
		return (
			<div>
				<div>La météo aujourd'hui à {this.city}</div>
			</div>
		)
	}
}