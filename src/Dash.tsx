import 'font-awesome/fonts/fontawesome-webfont.svg';
import { useEffect, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd';
import { emitCustomEvent } from 'react-custom-events';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Nav, TabContent } from 'reactstrap';
import './Dash.scss';
import CreateWidgetModal from './modals/CreateWidgetModal';
import ImportConfigModal from './modals/ImportConfigModal';
import { ITab } from './model/Tab';
import NavDash from './navigation/navDash/NavDash';
import Login from './pages/login/Login';
import { toggleSelectedTab } from './reducers/actions';
import { ITabState } from './reducers/tabReducer';
import authorizationBearer from './services/auth.header';
import authService from './services/auth.service';
import { exportConfig } from './services/config.service';
import { addTab, updateTabs } from './services/tab.service';
import { addWidget } from './services/widget.service';
import TabDash from './tab/TabDash';
import logger from './utils/LogUtils';
import { IWidgetConfig } from './widgets/IWidgetConfig';
import jwt_decode from 'jwt-decode';

export interface IMenu {
  link: string;
  icon: string;
}

interface jwt {
  sub: string;
  iat: number;
  exp: number;
}

export default function Dash(): React.ReactElement {
  const [tabs, setTabs] = useState<ITab[]>([]);
  const [newWidget, setNewWidget] = useState<IWidgetConfig>();

  const activeTab = useSelector((state: ITabState) => state.activeTab);
  const dispatch = useDispatch();
  const isMounted = useRef(false);

  const refreshTimeout = 900000; // 15 minutes

  useEffect(() => {
    if (isUserAuthenticated()) {
      initDashboard();
      const interval = setInterval(refreshAllWidgets, refreshTimeout);
      return () => clearInterval(interval); // Clear interval on unmount
    }
  }, []);

  useEffect(() => {
    if (isMounted.current && tabs && tabs.length === 0) {
      addNewTab();
    }
  }, [tabs]);

  function initDashboard() {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/tab/`, {
      headers: {
        Authorization: authorizationBearer(),
        'Content-type': 'application/json'
      }
    })
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

  function refreshAllWidgets() {
    emitCustomEvent('refreshAllWidgets');
  }

  function addNewTab() {
    const newTabLabel = 'Nouvel onglet';
    addTab(newTabLabel)
      .then((response) => {
        const insertedTab = response.data as ITab;
        setTabs(tabs.concat(insertedTab));
        dispatch(toggleSelectedTab(insertedTab.id));
      })
      .catch((error) => {
        logger.error(error.message);
      });
  }

  function getNewWidget(tabId: number) {
    if (newWidget && tabId === newWidget.tab.id) {
      return newWidget;
    } else {
      return undefined;
    }
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

  function reorder(list: unknown[], startIndex: number, endIndex: number): unknown[] {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }

    const items = reorder(tabs, result.source.index, result.destination.index).map((tab, index) => {
      (tab as ITab).tabOrder = index;
      return tab;
    });
    updateTabs(items as ITab[])
      .then((response) => setTabs(response.data as ITab[]))
      .catch((error) => logger.error(error.message));
  }

  function downloadConfig(): Promise<void> {
    return exportConfig()
      .then((response) => {
        logger.info('Configuration exportée');
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'dashboardConfig.json');
        document.body.appendChild(link);
        link.click();
      })
      .catch(() => {
        logger.error("Erreur lors de l'export de la configuration");
      });
  }

  function isTokenExpired(): boolean {
    const authenticatedUser = authService.getCurrentUser();
    if (!authenticatedUser || !authenticatedUser.accessToken) {
      return false;
    } else {
      return Date.now() >= jwt_decode<jwt>(authenticatedUser.accessToken).exp * 1000;
    }
  }

  function isUserAuthenticated(): boolean {
    return authService.getCurrentUser() !== null && !isTokenExpired();
  }

  return (
    <div className="dash">
      {!isUserAuthenticated() && <Login />}
      {isUserAuthenticated() && (
        <div className="flex flex-row">
          <div className="dashNavbar">
            {activeTab && tabs.length > 0 && (
              <Nav vertical={true} navbar={true}>
                <CreateWidgetModal onWidgetAdded={onWidgetAdded} />
                <div>
                  <Button id="reloadAllWidgetsButton" className="dashNavbarLink" onClick={refreshAllWidgets}>
                    <i className="fa fa-refresh fa-lg" aria-hidden="true" />
                  </Button>
                </div>
                <div>
                  <Button id="downloadConfigButton" className="dashNavbarLink" onClick={downloadConfig}>
                    <i className="fa fa-download fa-lg" aria-hidden="true" />
                  </Button>
                </div>

                <ImportConfigModal />
              </Nav>
            )}
          </div>

          <div className="flex flex-column tabsBar">
            <Nav tabs={true}>
              <div className="flex flex-row">
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable" direction="horizontal">
                    {(providedDroppable: DroppableProvided) => (
                      <div
                        className="flex flex-row"
                        {...providedDroppable.droppableProps}
                        ref={providedDroppable.innerRef}
                      >
                        {tabs.length > 0 &&
                          tabs.map((tab: ITab, index: number) => {
                            return (
                              <Draggable key={tab.id} draggableId={tab.id.toString()} index={index}>
                                {(providedDraggable) => (
                                  <div
                                    key={tab.id}
                                    ref={providedDraggable.innerRef}
                                    {...providedDraggable.draggableProps}
                                    {...providedDraggable.dragHandleProps}
                                    className={`tab ${tab.id === activeTab ? 'selectedItem' : ''}`}
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
                <Button onClick={authService.logout} className="btn btn-primary">
                  Se déconnecter
                </Button>
              </div>
            </Nav>
            <TabContent activeTab={activeTab}>
              {tabs.length > 0 &&
                tabs.map((tab: ITab) => {
                  return <TabDash key={tab.id} newWidget={getNewWidget(tab.id)} tabId={tab.id} />;
                })}
            </TabContent>
          </div>
        </div>
      )}
    </div>
  );
}
