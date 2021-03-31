import * as React from 'react';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import { TabPane } from 'reactstrap';
import { ITabState } from '../reducers/tabReducer';
import { WidgetTypes } from '../enums/WidgetsEnum';
import { deleteWidget, updateWidgets } from '../services/WidgetService';
import logger from '../utils/LogUtils';
import CalendarWidget from '../widgets/calendar/CalendarWidget';
import { IWidgetConfig } from '../widgets/IWidgetConfig';
import RSSWidget from '../widgets/rss/RSSWidget';
import StravaWidget from '../widgets/strava/StravaWidget';
import WeatherWidget from '../widgets/weather/WeatherWidget';

interface IProps {
  tabId: number;
  newWidget: any;
}

export default function TabDash(props: IProps): React.ReactElement {
  const [widgets, setWidgets] = useState([]);
  const activeTab = useSelector((state: ITabState) => state.activeTab);

  function createWidget(widgetConfig: IWidgetConfig) {
    switch (widgetConfig.type) {
      case WidgetTypes.WEATHER: {
        return (
          <WeatherWidget
            id={widgetConfig.id}
            tabId={widgetConfig.tab.id}
            {...widgetConfig.data}
            onDeleteButtonClicked={deleteWidgetFromDashboard}
          />
        );
      }
      case WidgetTypes.RSS: {
        return (
          <RSSWidget
            id={widgetConfig.id}
            tabId={widgetConfig.tab.id}
            {...widgetConfig.data}
            onDeleteButtonClicked={deleteWidgetFromDashboard}
          />
        );
      }
      case WidgetTypes.CALENDAR: {
        return (
          <CalendarWidget
            id={widgetConfig.id}
            tabId={widgetConfig.tab.id}
            {...widgetConfig.data}
            onDeleteButtonClicked={deleteWidgetFromDashboard}
          />
        );
      }
      case WidgetTypes.STRAVA: {
        return (
          <StravaWidget
            id={widgetConfig.id}
            tabId={widgetConfig.tab.id}
            {...widgetConfig.data}
            onDeleteButtonClicked={deleteWidgetFromDashboard}
          />
        );
      }
      default: {
        return;
      }
    }
  }

  function deleteWidgetFromDashboard(id: number) {
    deleteWidget(id)
      .then((response) => {
        if (response) {
          setWidgets(
            widgets.filter((widget: IWidgetConfig) => {
              return widget.id !== id;
            })
          );
        }
      })
      .catch((error: Error) => {
        logger.error(error.message);
      });
  }

  useEffect(() => {
    if (!widgets.length && activeTab === props.tabId) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/widget/?tabId=${props.tabId}`)
        .then((result) => {
          return result.json();
        })
        .then((result) => {
          setWidgets(result);
        })
        .catch((error: Error) => {
          logger.error(error.message);
        });
    }
  }, [activeTab]);

  useEffect(() => {
    if (props.newWidget) {
      setWidgets((widgets as any[]).concat([props.newWidget]) as []);
    }
  }, [props.newWidget != null && props.newWidget.id]);

  function reorder(list: any, startIndex: number, endIndex: number): any {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  function onDragEnd(result: any) {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      widgets,
      result.source.index,
      result.destination.index
    ).map((widget: IWidgetConfig, index: number) => {
      widget.widgetOrder = index;
      return widget;
    });
    updateWidgets(items).then((response) => setWidgets(response.data));
  }

  return (
    <TabPane tabId={props.tabId}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(providedDroppable: any) => (
            <div
              {...providedDroppable.droppableProps}
              ref={providedDroppable.innerRef}
            >
              <div className="widgetList">
                {widgets && widgets.length > 0 &&
                  widgets.map((widgetConfig: IWidgetConfig, index) => {
                    return (
                      <Draggable
                        key={widgetConfig.id}
                        draggableId={widgetConfig.id.toString()}
                        index={index}
                      >
                        {(providedDraggable) => (
                          <div
                            key={widgetConfig.id}
                            className="widget"
                            ref={providedDraggable.innerRef}
                            {...providedDraggable.draggableProps}
                            {...providedDraggable.dragHandleProps}
                          >
                            {createWidget(widgetConfig)}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                {providedDroppable.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </TabPane>
  );
}
