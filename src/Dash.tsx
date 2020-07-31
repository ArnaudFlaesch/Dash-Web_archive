import 'font-awesome/fonts/fontawesome-webfont.svg';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Nav, TabContent } from 'reactstrap';
import './Dash.scss';
import { ITab } from './model/Tab';
import NavDash from './navigation/navDash/NavDash';
import Store from './pages/store/Store';
import { toggleSelectedTab } from './reducers/actions';
import { ITabState } from './reducers/tabReducer';
import { addTab } from './services/TabService';
import { addWidget } from './services/WidgetService';
import TabDash from './tab/TabDash';
import logger from './utils/LogUtils';
import { IWidgetConfig } from './widgets/IWidgetConfig';

export interface IMenu {
	link: string;
	icon: string;
}

export default function Dash() {
	const [tabs, setTabs] = useState<ITab[]>([]);
	const [newWidget, setNewWidget] = useState<IWidgetConfig>()
	const [modal, setModal] = useState(false);

	const activeTab = useSelector((state: ITabState) => state.activeTab);
	const dispatch = useDispatch();

	function initDashboard() {
		fetch(`${process.env.REACT_APP_BACKEND_URL}/tab/`)
			.then((result) => {
				return result.json();
			})
			.then(result => {
				if (!result || result.length === 0) {
					addNewTab();
				}
				setTabs(result);
				dispatch(toggleSelectedTab(result[0].id.toString()))
			})
			.catch((error: Error) => {
				logger.error(error.message);
			});
	}

	function toggleTab(tab: string) {
		if (activeTab !== tab) {
			dispatch(toggleSelectedTab(tab))
		}
	}

	function addNewTab() {
		const newTabLabel = "Nouvel onglet";
		addTab(newTabLabel)
			.then((response) => {
				setTabs(tabs.concat(response.data));
				dispatch(toggleSelectedTab(response.data.id))
			})
	}

	function getNewWidget(tabId: number) {
		if (newWidget && tabId === newWidget.tab.id) {
			return newWidget;
		} else {
			return null;
		}
	}

	function toggleModal() {
		setModal(!modal);
	}

	function onWidgetAdded(type: any) {
		if (activeTab) {
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
	}

	function onTabDeleted(id: number) {
		setTabs(tabs.filter(tab => tab.id !== id))
		if (activeTab === id.toString()) {
			dispatch(toggleSelectedTab(tabs[0].id.toString()))
		}
	}

	useEffect(initDashboard, []);

	return (
		<div className="dash">
			<div className='flexRow'>
				<div className='dashNavbar'>
					<Nav vertical={true} navbar={true}>
						<Button id="openAddWidgetModal" className="dashNavbarLink" onClick={toggleModal}><i className="fa fa-plus-circle fa-lg" aria-hidden="true" /></Button>
						<Modal isOpen={modal} toggle={toggleModal}>
							<ModalHeader toggle={toggleModal}>Ajouter un widget</ModalHeader>
							<ModalBody>
								<Store onWidgetAdded={onWidgetAdded} /></ModalBody>
							<ModalFooter>
								<Button color="primary" onClick={toggleModal}>Fermer</Button>
							</ModalFooter>
						</Modal>
					</Nav>
				</div>

				<div className='flexColumn tabsBar'>
					<Nav tabs={true}>
						{
							tabs.map((tab: ITab) => {
								return (
									<NavDash key={tab.id.toString()} tab={tab} onTabClicked={() => toggleTab(tab.id.toString())} onTabDeleted={onTabDeleted} />
								)
							})
						}
						<Button onClick={addNewTab} className="fa fa-plus-circle fa-lg" />
					</Nav>
					<TabContent activeTab={activeTab}>
						{tabs.map((tab: ITab) => {
							return (
								<TabDash key={tab.id.toString()} newWidget={getNewWidget(tab.id)} tabId={tab.id.toString()} />
							)
						})
						}
					</TabContent>
				</div>
			</div>
		</div >
	);
}
