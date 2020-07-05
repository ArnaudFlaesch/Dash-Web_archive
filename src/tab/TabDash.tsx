import * as React from 'react';
import { useEffect, useState } from 'react';
import { TabPane } from 'reactstrap';
import { deleteWidget } from '../services/WidgetService';
import logger from '../utils/LogUtils';
import { IWidgetConfig } from '../widgets/IWidgetConfig';
import { WidgetTypes } from '../enums/WidgetsEnum';
import WeatherWidget from '../widgets/weather/WeatherWidget';
import RSSWidget from '../widgets/rss/RSSWidget';
import CalendarWidget from '../widgets/calendar/CalendarWidget';

interface IProps {
    tabId: string;
    newWidget: any;
}

export default function TabDash(props: IProps) {
    const [widgets, setWidgets] = useState([]);

    const createWidget = (widgetConfig: IWidgetConfig) => {
        switch (widgetConfig.type) {
            case WidgetTypes.WEATHER: {
                return <WeatherWidget id={widgetConfig.id} {...widgetConfig.data} onDeleteButtonClicked={deleteWidgetFromDashboard} />
            }
            case WidgetTypes.RSS: {
                return <RSSWidget id={widgetConfig.id} {...widgetConfig.data} onDeleteButtonClicked={deleteWidgetFromDashboard} />
            }
            case WidgetTypes.CALENDAR: {
                return <CalendarWidget id={widgetConfig.id} {...widgetConfig.data} onDeleteButtonClicked={deleteWidgetFromDashboard} />
            }
            default: {
                return;
            }
        }
    }

    const deleteWidgetFromDashboard = (id: number) => {
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
    }, [])

    useEffect(() => {
        console.log(props.newWidget)
        if (props.newWidget) {
            setWidgets(((widgets as any[]).concat([props.newWidget])) as []);
        }
    }, [props.newWidget != null])

    return (
        <TabPane tabId={props.tabId}>
            <div className='widgetList'>
                {
                    widgets &&
                    widgets.map((widgetConfig: IWidgetConfig) => {
                        return (
                            <div key={widgetConfig.id} className="widget" >
                                {createWidget(widgetConfig)}
                            </div>
                        );
                    })
                }
            </div>
        </TabPane >
    )
}