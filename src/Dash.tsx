import 'font-awesome/fonts/fontawesome-webfont.svg';
import * as React from 'react';
import './Dash.scss';
import { WidgetTypes } from './enums/WidgetsEnum';
import logger from './utils/LogUtils';
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
		fetch('http://localhost' + process.env.PORT + '/db')
			.then((result) => {
				return result.json();
			})
			.then(result => {
				this.setState({
					widgets: result
				});
			})
			.catch((error: Error) => {
				logger.debug(error);
			});
	}

	public createWidget(widgetConfig: IWidgetConfig) {
		switch (widgetConfig.type) {
			case 1: {
				return <WeatherWidget {...widgetConfig.data} />
			}
			case 2: {
				return <RSSWidget {...widgetConfig.data} />
			}
			case 3: {
				return <CalendarWidget {...widgetConfig.data} />
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