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
import Store from './pages/store/Store';
import { toggleSelectedTab } from './reducers/actions';
import { ITabState } from './reducers/tabReducer';
import { addTab, updateTabs } from './services/TabService';
import { addWidget } from './services/WidgetService';
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

  

  function toggleTab(tab: number) {
    if (activeTab !== tab) {
      dispatch(toggleSelectedTab(tab));
    }
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
    setTabs(tabs.filter((tab) => tab.id !== id));
    if (activeTab === id) {
      dispatch(toggleSelectedTab(tabs[0].id));
    }
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

  function addNewTab() {
      const newTabLabel = 'Nouvel onglet';
      addTab(newTabLabel).then((response) => {
        const insertedTab = response.data as ITab;
        setTabs(tabs.concat(insertedTab));
        dispatch(toggleSelectedTab(insertedTab.id));
      });
    }

  useEffect(() =>  {
    function initDashboard() {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/tab/`)
        .then((result) => {
          return result.json();
        })
        .then((result) => {
          if (!result || result.length === 0) {
            addNewTab();
          }
          setTabs(result);
          dispatch(toggleSelectedTab(result[0].id));
        })
        .catch((error: Error) => {
          logger.error(error.message);
        });
    }

    initDashboard();
  }, []);

  return (
    <div className="dash">
      <div className="flexRow">
        <div className="dashNavbar">
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
        </div>

        <div className="flexColumn tabsBar">
          <Nav tabs={true}>
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
                                className={`tab ${
                                  tab.id === activeTab ? 'selectedItem' : ''
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
    </div>
  );
}
