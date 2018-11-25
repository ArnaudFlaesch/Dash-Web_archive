import * as React from 'react';
import * as winston from 'winston';
import { IProperties } from '../IProperties';
import { RSSWidget } from "./widgets/rss/RSSWidget";
import { WeatherWidget } from './widgets/weather/WeatherWidget';

export interface IProps {
	token?: string;
}

interface IState {
	properties?: IProperties;
}

export class Dashboard extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.state = {};
		try {
			const propertiesJSON = require('../properties.json');
			this.state = { properties: propertiesJSON };
		}
		catch (error) {
			winston.log('debug', error.message);
		}
	}

	public render() {
		return (
			<div className="dashboard">
				{this.state.properties &&
					<WeatherWidget weather_api_key={this.state.properties.weather_api_key} />
				}
				{this.state.properties &&
					this.state.properties.urls.map((url: string) => {
						return (<RSSWidget key={url} url={url} />)
					})
				}
			</div>
		);
	}
}