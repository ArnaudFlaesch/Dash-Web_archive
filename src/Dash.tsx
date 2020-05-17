import axios from "axios";
import 'font-awesome/fonts/fontawesome-webfont.svg';
import * as React from 'react';
import './Dash.scss';
import { WidgetTypes } from './enums/WidgetsEnum';
import logger from './utils/LogUtils';
import CalendarWidget from './widgets/calendar/CalendarWidget';
import { RSSWidget } from "./widgets/rss/RSSWidget";
import { WeatherWidget } from './widgets/weather/WeatherWidget';

interface IState {
	widgets: IWidgetConfig[];
}

interface IWidgetConfig {
	id: number;
	type: WidgetTypes;
	data: any;
}

export default class Dashboard extends React.Component<any, IState> {

	constructor(props: any) {
		super(props);
		this.state = {
			widgets: []
		};
		this.deleteWidget = this.deleteWidget.bind(this);
	}

	public componentDidMount() {
		fetch(`${process.env.REACT_APP_BACKEND_URL}/db`)
			.then((result) => {
				return result.json();
			})
			.then(result => {
				this.setState({
					widgets: result
				});
			})
			.catch((error: Error) => {
				logger.error(error.message);
			});
	}

	public createWidget(widgetConfig: IWidgetConfig) {
		switch (widgetConfig.type) {
			case WidgetTypes.WEATHER: {
				return <WeatherWidget id={widgetConfig.id} {...widgetConfig.data} onDeleteButtonClicked={this.deleteWidget} />
			}
			case WidgetTypes.RSS: {
				return <RSSWidget id={widgetConfig.id} {...widgetConfig.data} onDeleteButtonClicked={this.deleteWidget} />
			}
			case WidgetTypes.CALENDAR: {
				return <CalendarWidget id={widgetConfig.id} {...widgetConfig.data} onDeleteButtonClicked={this.deleteWidget} />
			}
			default: {
				return;
			}
		}
	}

	public deleteWidget(id: number) {
		axios.post(`${process.env.REACT_APP_BACKEND_URL}/db/deleteWidget`, { "id": id },
			{
				headers: {
					'Content-type': 'application/json'
				}
			})
			.then(response => {
				if (response) {
					this.setState({
						widgets: this.state.widgets.filter((widget) => {
							return widget.id !== id;
						})
					});
				}
			})
			.catch(error => {
				logger.error(error.message);
			})
	}

	public render() {
		return (
			<div className="dash">
				{
					this.state.widgets &&
					this.state.widgets.map((widgetConfig: IWidgetConfig) => {
						return (
							<div key={widgetConfig.id} className="widget">
								{this.createWidget(widgetConfig)}
							</div>
						);
					})
				}

			</div>

		);
	}
}