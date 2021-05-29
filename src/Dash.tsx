import 'font-awesome/fonts/fontawesome-webfont.svg';
import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DroppableProvided,
  DropResult
} from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  TabContent
} from 'reactstrap';
import './Dash.scss';
import { ITab } from './model/Tab';
import NavDash from './navigation/navDash/NavDash';
import Login from './pages/login/Login';
import Store from './pages/store/Store';
import { toggleSelectedTab } from './reducers/actions';
import { ITabState } from './reducers/tabReducer';
import authHeader from './services/auth.header';
import authService from './services/auth.service';
import { addTab, updateTabs } from './services/tab.service';
import { addWidget } from './services/widget.service';
import TabDash from './tab/TabDash';
import logger from './utils/LogUtils';
import { IWidgetConfig } from './widgets/IWidgetConfig';

export interface IMenu {
  link: string;
  icon: string;
}

export default function Dash(): React.ReactElement {
  const [tabs, setTabs] = useState<ITab[]>([]);
  const [newWidget, setNewWidget] = useState<IWidgetConfig>();
  const [modal, setModal] = useState(false);

  const activeTab = useSelector((state: ITabState) => state.activeTab);
  const dispatch = useDispatch();
  const isMounted = React.useRef(false);

  useEffect(() => {
    if (isMounted.current && tabs && tabs.length === 0) {
      addNewTab();
    }
  }, [tabs])

  function initDashboard() {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/tab/`, authHeader())
      .then((result) => {
        return result.json();
      })
      .then((result) => {
        setTabs(result);
        if (result && result.length > 0) {
          dispatch(toggleSelectedTab(result[0].id));
        }
        isMounted.current = true;
      })
      .catch((error: Error) => {
        logger.error(error.message);
      });
  }

  function toggleTab(tab: number) {
    if (activeTab !== tab) {
      dispatch(toggleSelectedTab(tab));
    }
  }

  function addNewTab() {
    const newTabLabel = 'Nouvel onglet';
    addTab(newTabLabel).then((response) => {
      const insertedTab = response.data as ITab;
      setTabs(tabs.concat(insertedTab));
      dispatch(toggleSelectedTab(insertedTab.id));
    });
  }

  function getNewWidget(tabId: number) {
    if (newWidget && tabId === newWidget.tab.id) {
      return newWidget;
    } else {
      return undefined;
    }
  }

  function toggleModal() {
    setModal(!modal);
  }

  function onWidgetAdded(type: React.MouseEvent<HTMLButtonElement>) {
    if (activeTab) {
      addWidget(type.currentTarget.value, activeTab)
        .then((response) => {
          if (response) {
            const widgetData = response.data as IWidgetConfig;
            setNewWidget(widgetData);
          }
        })
        .catch((error) => {
          logger.error(error.message);
        });
    }
  }

  function onTabDeleted(id: number) {
    if (tabs.length > 1) {
      if (tabs[0].id === id) {
        dispatch(toggleSelectedTab(tabs[1].id));
      } else if (activeTab === id) {
        dispatch(toggleSelectedTab(tabs[0].id));
      } else {
        dispatch(toggleSelectedTab(activeTab));
      }
    }
    setTabs(tabs.filter((tab) => tab.id !== id));
  }

  function reorder(
    list: unknown[],
    startIndex: number,
    endIndex: number
  ): unknown[] {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      tabs,
      result.source.index,
      result.destination.index
    ).map((tab, index) => {
      (tab as ITab).tabOrder = index;
      return tab;
    });
    updateTabs(items as ITab[]).then((response) => {
      setTabs(response.data as ITab[]);
    });
  }

  useEffect(initDashboard, []);

  return (
    <div className="dash">
      {!authService.getCurrentUser() &&
        <Login />
      }
      { authService.getCurrentUser() &&
        <div className="flexRow">
          <div className="dashNavbar">
            {activeTab && tabs.length > 0 &&
              <Nav vertical={true} navbar={true}>
                <Button
                  id="openAddWidgetModal"
                  className="dashNavbarLink"
                  onClick={toggleModal}
                >
                  <i className="fa fa-plus-circle fa-lg" aria-hidden="true" />
                </Button>
                <Modal isOpen={modal} toggle={toggleModal}>
                  <ModalHeader toggle={toggleModal}>Ajouter un widget</ModalHeader>
                  <ModalBody>
                    <Store onWidgetAdded={onWidgetAdded} />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      id="closeAddWidgetModal"
                      color="primary"
                      onClick={toggleModal}
                    >
                      Fermer
              </Button>
                  </ModalFooter>
                </Modal>
              </Nav>
            }
          </div>

          <div className="flexColumn tabsBar">
            <Nav tabs={true}>
              <div className="flexRow">
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable" direction="horizontal">
                    {(providedDroppable: DroppableProvided) => (
                      <div
                        className="flexRow"
                        {...providedDroppable.droppableProps}
                        ref={providedDroppable.innerRef}
                      >
                        {tabs.length > 0 &&
                          tabs.map((tab: ITab, index: number) => {
                            return (
                              <Draggable
                                key={tab.id}
                                draggableId={tab.id.toString()}
                                index={index}
                              >
                                {(providedDraggable) => (
                                  <div
                                    key={tab.id}
                                    ref={providedDraggable.innerRef}
                                    {...providedDraggable.draggableProps}
                                    {...providedDraggable.dragHandleProps}
                                    className={`tab ${tab.id === activeTab ? 'selectedItem' : ''
                                      }`}
                                  >
                                    <NavDash
                                      tab={tab}
                                      onTabClicked={() => toggleTab(tab.id)}
                                      onTabDeleted={onTabDeleted}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                        {providedDroppable.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                <Button onClick={addNewTab} id="addNewTabButton" className="fa fa-plus-circle fa-lg" />
                <Button onClick={authService.logout} className="btn btn-primary">Se déconnecter</Button>
              </div>
            </Nav>
            <TabContent activeTab={activeTab}>

              {tabs.length > 0 &&
                tabs.map((tab: ITab) => {
                  return (
                    <TabDash
                      key={tab.id}
                      newWidget={getNewWidget(tab.id)}
                      tabId={tab.id}
                    />
                  );
                })}
            </TabContent>
          </div>
        </div>
      }
    </div>
  );
}
