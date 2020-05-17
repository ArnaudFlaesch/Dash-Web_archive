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
			case 1: {
				return <WeatherWidget id={widgetConfig.id} {...widgetConfig.data} />
			}
			case 2: {
				return <RSSWidget id={widgetConfig.id} {...widgetConfig.data} />
			}
			case 3: {
				return <CalendarWidget id={widgetConfig.id} {...widgetConfig.data} />
			}
			default: {
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
								{this.createWidget(widgetConfig)}
							</div>
						);
					})
				}

			</div>

		);
	}
}