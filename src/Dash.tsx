import * as React from 'react';
import './Dash.scss';
import { IProperties } from './IProperties';
import { logger } from './utils/logger';
import FacebookWidget from './widgets/facebook/FacebookWidget';
import { RSSWidget } from "./widgets/rss/RSSWidget";
import { WeatherWidget } from './widgets/weather/WeatherWidget';

export interface IProps {
	token?: string;
}

interface IState {
	properties?: IProperties;
}

export default class Dashboard extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.state = {};
		try {
			const propertiesJSON = require('./properties.json');
			this.state = { properties: propertiesJSON };
		}
		catch (error) {
			logger.debug(error.message);
		}
	}

	public render() {
		return (
			<div className="dash">
				{
					this.state.properties?.weather_api_key &&
					this.state.properties.cities.map((city: string) => {
						return (<WeatherWidget key={city} city={city} weather_api_key={this.state.properties?.weather_api_key} />)
					})
				}
				{this.state.properties &&
					this.state.properties.urls.map((url: string) => {
						return (<RSSWidget key={url} url={url} />)
					})
				}
				{this.state.properties &&
					<FacebookWidget  {...this.state.properties.facebook} />
				}
			</div>
		);
	}
}