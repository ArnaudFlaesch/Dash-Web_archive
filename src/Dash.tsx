import 'font-awesome/fonts/fontawesome-webfont.svg';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Nav, TabContent, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import './Dash.scss';
import NavDash from './navigation/navDash/NavDash';
import Store from './pages/store/Store';
import { addWidget } from './services/WidgetService';
import TabDash from './tab/TabDash';
import logger from './utils/LogUtils';
import { IWidgetConfig } from './widgets/IWidgetConfig';
import { addTab } from './services/TabService';

export interface IMenu {
	link: string;
	icon: string;
}

export default function Dash() {
	const [tabs, setTabs] = useState([]);
	const [activeTab, setActiveTab] = useState('1');
	const [newWidget, setNewWidget] = useState<IWidgetConfig>()
	const [modal, setModal] = useState(false);

	function toggleTab(tab: string) {
		if (activeTab !== tab) {
			setActiveTab(tab);
		}
	}

	function addNewTab() {
		const newTabLabel = "Nouvel onglet";
		addTab(newTabLabel)
			.then(response => setTabs(tabs.concat(response.data)))
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
						<button className="dashNavbarLink" onClick={toggleModal}><i className="fa fa-plus-circle fa-lg" aria-hidden="true" /></button>
						<Modal isOpen={modal} toggle={toggleModal}>
							<ModalHeader toggle={toggleModal}>Ajouter un widget</ModalHeader>
							<ModalBody>
								<Store onWidgetAdded={onWidgetAdded} /></ModalBody>
							<ModalFooter>
								<button color="primary" onClick={toggleModal}>Fermer</button>
							</ModalFooter>
						</Modal>
					</Nav>
				</div>

				<div className='flexColumn tabsBar'>
					<Nav tabs={true}>
						{
							tabs.map((tab: any) => {
								return (
									<NavDash key={tab.id} id={tab.id} label={tab.label} onTabClicked={() => toggleTab(tab.id.toString())} />
								)
							})
						}
						<Button onClick={addNewTab} className="fa fa-plus-circle fa-lg"></Button>
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
			</div>
		</div >
	);
}
