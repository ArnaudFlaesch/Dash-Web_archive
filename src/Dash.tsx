import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { Button, IconButton } from '@mui/material';
import jwt_decode from 'jwt-decode';
import { useEffect, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd';
import { emitCustomEvent } from 'react-custom-events';
import { useDispatch, useSelector } from 'react-redux';
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
import './Dash.scss';
export interface IMenu {
  link: string;
  icon: string;
}

interface IJwt {
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
      return Date.now() >= jwt_decode<IJwt>(authenticatedUser.accessToken).exp * 1000;
    }
  }

  function isUserAuthenticated(): boolean {
    return authService.getCurrentUser() !== null && !isTokenExpired();
  }

  return (
    <div>
      {!isUserAuthenticated() && <Login />}
      {isUserAuthenticated() && (
        <TabContext value={activeTab.toString()}>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between m-1">
              <div className="flex flex-row ">
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable" direction="horizontal">
                    {(providedDroppable: DroppableProvided) => (
                      <div {...providedDroppable.droppableProps} ref={providedDroppable.innerRef}>
                        <TabList>
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
                        </TabList>
                        {providedDroppable.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                <IconButton id="addNewTabButton" color="primary" onClick={addNewTab}>
                  <AddCircleOutlineIcon />
                </IconButton>
              </div>
              <div className="flex flex-row">
                <div className="flex flex-row m-auto">
                  <CreateWidgetModal onWidgetAdded={onWidgetAdded} />

                  <div>
                    <IconButton id="reloadAllWidgetsButton" color="primary" onClick={refreshAllWidgets}>
                      <RefreshIcon />
                    </IconButton>
                  </div>

                  <div>
                    <IconButton id="downloadConfigButton" color="primary" onClick={downloadConfig}>
                      <DownloadIcon />
                    </IconButton>
                  </div>

                  <ImportConfigModal />
                </div>
                <Button onClick={authService.logout} variant="contained">
                  Déconnexion
                </Button>
              </div>
            </div>
            {tabs.length > 0 &&
              tabs.map((tab: ITab) => {
                return <TabDash key={tab.id} newWidget={getNewWidget(tab.id)} tabId={tab.id} />;
              })}
          </div>
        </TabContext>
      )}
    </div>
  );
}
