import 'font-awesome/fonts/fontawesome-webfont.svg';
import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Nav, NavItem, NavLink, TabContent } from 'reactstrap';
import './Dash.scss';
import Navbar from './navbar/Navbar';
import Store from './pages/store/Store';
import { addWidget } from './services/WidgetService';
import TabDash from './tab/TabContent';
import logger from './utils/LogUtils';


interface IState {
	activeTab?: string;
	tabs: any[]
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
			activeTab: undefined,
			tabs: []
		};
		//this.createWidget = this.createWidget.bind(this);
		this.onWidgetAdded = this.onWidgetAdded.bind(this);
	}

	public componentDidMount() {
		fetch(`${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/tab`)
			.then((result) => {
				return result.json();
			})
			.then(result => {
				this.setState({
					tabs: result,
					activeTab: result[0].id.toString()
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
					//const widgetData: IWidgetConfig = response.data;
					//this.createWidget(widgetData);
					//this.setState({ widgets: this.state.widgets.concat(widgetData) })
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
										{
											this.state.tabs.map(tab => {
												return (
													<NavItem className="clickable-item" key={tab.id}>
														<NavLink onClick={() => { this.toggle(tab.id.toString()); }}>
															{tab.label}
														</NavLink>
													</NavItem>
												)
											})
										}
									</Nav>
									<TabContent activeTab={this.state.activeTab}>
										{this.state.tabs.map(tab => {
											return (
												<TabDash key={tab.id} tabId={tab.id.toString()} />
											)
										})
										}
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