import 'font-awesome/fonts/fontawesome-webfont.svg';
import * as React from 'react';
import './Dash.scss';
import { WidgetTypes } from './enums/WidgetsEnum';
import { logger } from './utils/logger';
import CalendarWidget from './widgets/calendar/CalendarWidget';
import { RSSWidget } from "./widgets/rss/RSSWidget";
import { WeatherWidget } from './widgets/weather/WeatherWidget';

export interface IProps {
	token?: string;
}

interface IState {
	widgets: IWidgetConfig[];
}

interface IWidgetConfig {
	id: string;
	type: WidgetTypes;
	data: any;
}

export default class Dashboard extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.state = {
			widgets: []
		};
	}

	public componentDidMount() {
		try {
			this.setState({widgets : require('./widgets.json')})
		}
		catch (error) {
			logger.debug(error.message);
		}
	}

	public createWidget(widgetConfig: IWidgetConfig) {
		switch (widgetConfig.type) {
			case 1 : {
				return <WeatherWidget {...widgetConfig.data} />
			}
			case 2 : {
				return <RSSWidget {...widgetConfig.data} />
			}
			case 3 : {
				return <CalendarWidget {...widgetConfig.data} />
			}
			default : {
				return;
			}
		}
	}

	public render() {
		return (
			<div className="dash">
				{
					this.state.widgets &&
					this.state.widgets.map((widgetConfig: IWidgetConfig) => {
						return (
							<div key={widgetConfig.id} className="widget">
								{ this.createWidget(widgetConfig) }
							</div>
						);
					})
				/*
					this.state.properties?.weather_api_key &&
					this.state.properties.cities.map((city: string) => {
						return (
							<div key={city} className="widget">
								<div className="header">
									Header
								</div>
								<div className="widgetBody">
									<WeatherWidget city={city} weather_api_key={this.state.properties?.weather_api_key} />
								</div>
							</div>)
					})
				}
				{
					this.state.properties?.calendarsUrls &&
					<div className="widget">
						<div className="header">
							Header
						</div>
						<div className="widgetBody">
							<CalendarWidget calendars={this.state.properties?.calendarsUrls} />
						</div>
					</div>
				}
				{this.state.properties &&
					this.state.properties.urls.map((url: string) => {
						return (
							<div key={url} className="widget">
								<div className="header">
									Header
								</div>
								<div className="widgetBody">
									<RSSWidget url={url} />
								</div>
							</div>
						)
					})
				}
				{this.state.properties &&
					<FacebookWidget  {...this.state.properties.facebook} />
				*/}

			</div>

		);
	}
}