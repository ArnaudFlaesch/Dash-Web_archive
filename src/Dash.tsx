import axios from "axios";
import 'font-awesome/fonts/fontawesome-webfont.svg';
import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './Dash.scss';
import { WidgetTypes } from './enums/WidgetsEnum';
import Navbar from './navbar/Navbar';
import Store from './pages/store/Store';
import { addWidget } from './services/WidgetService';
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

export interface IMenu {
	link: string;
	icon: string;
}

export default class Dashboard extends React.Component<any, IState> {

	private navItems: IMenu[] = [
		{
			link: '/',
			icon: 'fa fa-home fa-lg'
		},
		{
			link: '/store',
			icon: 'fa fa-plus-circle fa-lg'
		},
		{
			link: '/profile',
			icon: 'fa fa-user fa-lg'
		}
	];

	constructor(props: any) {
		super(props);
		this.state = {
			widgets: []
		};
		this.createWidget = this.createWidget.bind(this);
		this.onWidgetAdded = this.onWidgetAdded.bind(this);
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

	public onWidgetAdded(type: any) {
		addWidget(type.target.value)
			.then((response) => {
				if (response) {
					const widgetData: IWidgetConfig = response.data;
					this.createWidget(widgetData);
					this.setState({ widgets: this.state.widgets.concat(widgetData) })
				}
			})
			.catch(error => {
				logger.error(error.message);
			})

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
				<Router>
					<div className='flexRow'>
						<Navbar navItems={this.navItems} />

						<Switch>
							<Route exact path="/">
								<div className='widgetList'>
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
							</Route>
							<Route path="/store">
								<Store onWidgetAdded={this.onWidgetAdded} />
							</Route>
							<Route path="/profile">

							</Route>
						</Switch>
					</div>
				</Router>
			</div>

		);
	}
}