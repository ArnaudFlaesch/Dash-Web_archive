import React, { Component } from 'react';
import { RSSWidget } from "./widgets/RSSWidget";
import { WeatherWidget } from './widgets/WeatherWidget';

export class Dashboard extends Component {

	constructor(props) {
		super(props);
		this.properties = "";

		import("../properties.json")
			.then(properties => {
				this.properties = properties;
				this.urls = this.properties.urls;
				this.setState(this.properties);
			})
			.catch(error => {
				console.log(error);
			})
	}

	render() {
		return (

			<div className="dashboard">
				{this.properties !== "" &&
					<WeatherWidget weather_api_key={this.properties.weather_api_key} />
				}
				{this.properties !== "" &&
					this.urls.map(url => {
						return (<RSSWidget key={url} url={url} />)
					})
				}
			</div>
		);
	}

}