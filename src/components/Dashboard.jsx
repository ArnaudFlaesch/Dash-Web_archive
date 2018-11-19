import React, { Component } from 'react';
import { RSSWidget } from "./widgets/RSSWidget";
import { WeatherWidget } from './widgets/WeatherWidget';

import properties from "../properties.json";

export class Dashboard extends Component {

	constructor(props) {
		super(props);
		this.properties = properties;
		this.urls = this.properties.urls;
	}

	render() {
		return (
			<div className="dashboard">
				<WeatherWidget weather_api_key={this.properties.weather_api_key} />
				{
					this.urls.map(url => {
						return (<RSSWidget key={url} url={url} />)
					})
				}
			</div>
		);
	}

}