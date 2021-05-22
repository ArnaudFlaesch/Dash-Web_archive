import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DroppableProvided,
  DropResult
} from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import { TabPane } from 'reactstrap';
import { ITabState } from '../reducers/tabReducer';
import { WidgetTypes } from '../enums/WidgetsEnum';
import { deleteWidget, updateWidgetsOrder } from '../services/WidgetService';
import logger from '../utils/LogUtils';
import CalendarWidget from '../widgets/calendar/CalendarWidget';
import { IWidgetConfig } from '../widgets/IWidgetConfig';
import RSSWidget from '../widgets/rss/RSSWidget';
import StravaWidget from '../widgets/strava/StravaWidget';
import WeatherWidget from '../widgets/weather/WeatherWidget';
import FacebookWidget from 'src/widgets/facebook/FacebookWidget';
import SteamWidget from 'src/widgets/steam/SteamWidget';

interface IProps {
  tabId: number;
  newWidget?: IWidgetConfig;
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
      case WidgetTypes.STEAM: {
        return (
          <SteamWidget
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
      setWidgets((widgets as IWidgetConfig[]).concat([props.newWidget]) as []);
    }
  }, [props.newWidget != null && props.newWidget.id]);

  function reorder(
    list: never[],
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
      widgets,
      result.source.index,
      result.destination.index
    ).map((widget: unknown, index: number) => {
      (widget as IWidgetConfig).widgetOrder = index;
      return widget;
    });
    updateWidgetsOrder(items as never[]).then((response) =>
      setWidgets(response.data as [])
    );
  }

  return (
    <TabPane tabId={props.tabId}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(providedDroppable: DroppableProvided) => (
            <div
              {...providedDroppable.droppableProps}
              ref={providedDroppable.innerRef}
            >
              <div className="widgetList">
                <FacebookWidget />
                {widgets &&
                  widgets.length > 0 &&
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
