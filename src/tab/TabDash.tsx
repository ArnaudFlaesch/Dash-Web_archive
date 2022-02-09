import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SteamWidget from 'src/widgets/steam/SteamWidget';
import TwitterTimelineWidget from 'src/widgets/twitter/TwitterTimelineWidget';
import { WidgetTypes } from '../enums/WidgetsEnum';
import { IReducerState } from '../reducers/rootReducer';
import { deleteWidget, getWidgets } from '../services/widget.service';
import logger from '../utils/LogUtils';
import CalendarWidget from '../widgets/calendar/CalendarWidget';
import { IWidgetConfig } from '../widgets/IWidgetConfig';
import RSSWidget from '../widgets/rss/RSSWidget';
import StravaWidget from '../widgets/strava/StravaWidget';
import WeatherWidget from '../widgets/weather/WeatherWidget';
import TabPanel from '@mui/lab/TabPanel';

interface IProps {
  tabId: number;
  newWidget?: IWidgetConfig;
}

export default function TabDash(props: IProps): React.ReactElement {
  const [widgets, setWidgets] = useState<IWidgetConfig[]>([]);
  const activeTab = useSelector((state: IReducerState) => state.activeTab);

  useEffect(() => {
    if (activeTab === props.tabId) {
      getWidgets(props.tabId)
        .then((response) => setWidgets(response.data))
        .catch((error: Error) => logger.error(error.message));
    }
  }, [activeTab]);

  useEffect(() => {
    if (props.newWidget) {
      setWidgets(widgets.concat([props.newWidget]) as []);
    }
  }, [props.newWidget != null && props.newWidget.id]);

  function createWidget(widgetConfig: IWidgetConfig) {
    const props = {
      id: widgetConfig.id,
      tabId: widgetConfig.tab.id,
      ...widgetConfig.data,
      onDeleteButtonClicked: deleteWidgetFromDashboard
    };
    switch (widgetConfig.type) {
      case WidgetTypes.WEATHER:
        return <WeatherWidget {...props} />;
      case WidgetTypes.RSS:
        return <RSSWidget {...props} />;
      case WidgetTypes.CALENDAR:
        return <CalendarWidget {...props} />;
      case WidgetTypes.STRAVA:
        return <StravaWidget {...props} />;
      case WidgetTypes.STEAM:
        return <SteamWidget {...props} />;
      case WidgetTypes.TWITTER_TIMELINE:
        return <TwitterTimelineWidget {...props} />;
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
      .catch((error: Error) => logger.error(error.message));
  }

  return (
    <div>
      {props.tabId === activeTab && (
        <TabPanel value={props.tabId.toString()} className="widgetList grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {widgets &&
            widgets.length > 0 &&
            widgets.map((widgetConfig: IWidgetConfig) => {
              return <div key={widgetConfig.id}>{createWidget(widgetConfig)}</div>;
            })}
        </TabPanel>
      )}
    </div>
  );
}
