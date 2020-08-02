import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TabPane } from 'reactstrap';
import { ITabState } from 'src/reducers/tabReducer';
import { WidgetTypes } from '../enums/WidgetsEnum';
import { deleteWidget } from '../services/WidgetService';
import logger from '../utils/LogUtils';
import CalendarWidget from '../widgets/calendar/CalendarWidget';
import { IWidgetConfig } from '../widgets/IWidgetConfig';
import RSSWidget from '../widgets/rss/RSSWidget';
import StravaWidget from "../widgets/strava/StravaWidget";
import WeatherWidget from '../widgets/weather/WeatherWidget';

interface IProps {
    tabId: string;
    newWidget: any;
}

export default function TabDash(props: IProps) {
    const [widgets, setWidgets] = useState([]);
    const activeTab = useSelector((state: ITabState) => state.activeTab);

    function createWidget(widgetConfig: IWidgetConfig) {
        switch (widgetConfig.type) {
            case WidgetTypes.WEATHER: {
                return <WeatherWidget id={widgetConfig.id} tabId={widgetConfig.tab.id} {...widgetConfig.data} onDeleteButtonClicked={deleteWidgetFromDashboard} />
            }
            case WidgetTypes.RSS: {
                // return <Widget id={widgetConfig.id} tabId={widgetConfig.tab.id} onDeleteButtonClicked={deleteWidgetFromDashboard} />
                return <RSSWidget id={widgetConfig.id} tabId={widgetConfig.tab.id} {...widgetConfig.data} onDeleteButtonClicked={deleteWidgetFromDashboard} />
            }
            case WidgetTypes.CALENDAR: {
                return <CalendarWidget id={widgetConfig.id} tabId={widgetConfig.tab.id} {...widgetConfig.data} onDeleteButtonClicked={deleteWidgetFromDashboard} />
            }
            case WidgetTypes.STRAVA: {
                return <StravaWidget id={widgetConfig.id} tabId={widgetConfig.tab.id} {...widgetConfig.data} onDeleteButtonClicked={deleteWidgetFromDashboard} />
            }
            default: {
                return;
            }
        }
    }

    function deleteWidgetFromDashboard(id: number) {
        deleteWidget(id)
            .then(response => {
                if (response) {
                    setWidgets(widgets.filter((widget: IWidgetConfig) => {
                        return widget.id !== id;
                    }))
                }
            })
            .catch((error: Error) => {
                logger.error(error.message);
            })
    }

    useEffect(() => {
        if (!widgets.length && activeTab === props.tabId) {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/widget/?tabId=${props.tabId}`)
                .then((result) => {
                    return result.json();
                })
                .then(result => {
                    setWidgets(result);
                })
                .catch((error: Error) => {
                    logger.error(error.message);
                });
        }
    }, [activeTab])

    useEffect(() => {
        if (props.newWidget) {
            setWidgets(((widgets as any[]).concat([props.newWidget])) as []);
        }
    }, [props.newWidget != null && props.newWidget.id])

    return (
        <TabPane tabId={props.tabId}>
            <div className='widgetList'>
                {
                    widgets &&
                    widgets.map((widgetConfig: IWidgetConfig) => {
                        return (
                            <div key={widgetConfig.id} className="widget">
                                {createWidget(widgetConfig)}
                            </div>
                        );
                    })
                }
            </div>
        </TabPane>
    )
}