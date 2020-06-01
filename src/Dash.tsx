import 'font-awesome/fonts/fontawesome-webfont.svg';
import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import './Dash.scss';
import { WidgetTypes } from './enums/WidgetsEnum';
import Navbar from './navbar/Navbar';
import Store from './pages/store/Store';
import { addWidget, deleteWidget } from './services/WidgetService';
import logger from './utils/LogUtils';
import CalendarWidget from './widgets/calendar/CalendarWidget';
import { RSSWidget } from "./widgets/rss/RSSWidget";
import { WeatherWidget } from './widgets/weather/WeatherWidget';

interface IState {
	widgets: IWidgetConfig[];
	activeTab: string;
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

	private toggle(tab: string) {
		if (this.state.activeTab !== tab) this.setState({ activeTab: tab });
	}

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
			widgets: [],
			activeTab: '1'
		};
		this.createWidget = this.createWidget.bind(this);
		this.onWidgetAdded = this.onWidgetAdded.bind(this);
		this.deleteWidget = this.deleteWidget.bind(this);
	}

	public componentDidMount() {
		fetch(`${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/widget`)
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
					this.props.history.push('/home');
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
		deleteWidget(id)
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
								<div className='flexColumn tabsBar'>
									<Nav tabs={true}>
										<NavItem>
											<NavLink onClick={() => { this.toggle('1'); }}>
												Tab1
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink onClick={() => { this.toggle('2'); }}>
												Moar Tabs
          									</NavLink>
										</NavItem>
									</Nav>
									<TabContent activeTab={this.state.activeTab}>
										<TabPane tabId="1">
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
										</TabPane>
										<TabPane tabId="2">
											Tab 2
										</TabPane>
									</TabContent>
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
			</div >

		);
	}
}