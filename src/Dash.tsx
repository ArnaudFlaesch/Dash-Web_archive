import 'font-awesome/fonts/fontawesome-webfont.svg';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Popup from "reactjs-popup";
import { Nav, TabContent } from 'reactstrap';
import './Dash.scss';
import NavDash from './navigation/navDash/NavDash';
import Store from './pages/store/Store';
import { addWidget } from './services/WidgetService';
import TabDash from './tab/TabDash';
import logger from './utils/LogUtils';
import { IWidgetConfig } from './widgets/IWidgetConfig';

export interface IMenu {
	link: string;
	icon: string;
}

export default function Dash(props: any) {
	const [tabs, setTabs] = useState([]);
	const [activeTab, setActiveTab] = useState('1');
	const [newWidget, setNewWidget] = useState<IWidgetConfig>()

	const toggle = (tab: string) => {
		if (activeTab !== tab) {
			setActiveTab(tab);
		}
	}

	const getNewWidget = (tabId: number) => {
		if (newWidget && tabId === newWidget.tab.id ) {
			return newWidget;
		} else {
			return null;
		}
	}

	const onWidgetAdded = (type: any) => {
		addWidget(type.target.value, parseInt(activeTab, 0))
			.then((response) => {
				if (response) {
					const widgetData: IWidgetConfig = response.data;
					setNewWidget(widgetData);
				}
			})
			.catch(error => {
				logger.error(error.message);
			})
	}


	useEffect(() => {
		fetch(`${process.env.REACT_APP_BACKEND_URL}/tab/`)
			.then((result) => {
				return result.json();
			})
			.then(result => {
				setTabs(result);
				setActiveTab(result[0].id.toString())
			})
			.catch((error: Error) => {
				logger.error(error.message);
			});
	}, []);

	return (
		<div className="dash">
			<div className='flexRow'>
				<div className='dashNavbar'>
					<Nav vertical={true} navbar={true}>
						<Popup trigger={<button className="dashNavbarLink">
							<i className="fa fa-plus-circle fa-lg" aria-hidden="true" />
						</button>} position="right center">
							<Store onWidgetAdded={onWidgetAdded} />
						</Popup>
					</Nav>
				</div>

				<div className='flexColumn tabsBar'>
					<Nav tabs={true}>
						{
							tabs.map((tab: any) => {
								return (
									<NavDash id={tab.id} label={tab.label} onTabClicked={() => toggle(tab.id.toString())} />
								)
							})
						}
					</Nav>
					<TabContent activeTab={activeTab}>
						{tabs.map((tab: any, index: number) => {
							return (
								<TabDash key={tab.id} newWidget={getNewWidget(tab.id)} tabId={tab.id.toString()} />
							)
						})
						}
					</TabContent>
				</div>
			</div >
		</div >
	);
}
