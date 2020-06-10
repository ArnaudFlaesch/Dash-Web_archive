import * as React from 'react';
import { useEffect, useState } from 'react';
import { TabPane } from 'reactstrap';
import { WidgetTypes } from '../enums/WidgetsEnum';
import { deleteWidget } from '../services/WidgetService';
import logger from '../utils/LogUtils';
import CalendarWidget from '../widgets/calendar/CalendarWidget';
import RSSWidget from '../widgets/rss/RSSWidget';
import WeatherWidget from '../widgets/weather/WeatherWidget';

interface IWidgetConfig {
    id: number;
    type: WidgetTypes;
    data: any;
}

function createWidget(widgetConfig: IWidgetConfig) {
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

function deleteWidgetFromDashboard(id: number) {
    deleteWidget(id)
        .then(response => {
            if (response) {
                /*this.setState({
                    widgets: this.state.widgets.filter((widget) => {
                        return widget.id !== id;
                    })
                }); */
            }
        })
        .catch((error: Error) => {
            logger.error(error.message);
        })
}

export default function TabDash(props: any) {
    const [widgets, setWidgets] = useState([]);

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