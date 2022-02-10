import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SteamWidget from 'src/widgets/steam/SteamWidget';
import TwitterTimelineWidget from 'src/widgets/twitter/TwitterTimelineWidget';
import { WidgetTypes } from '../enums/WidgetsEnum';
import { IReducerState } from '../reducers/rootReducer';
import { deleteWidget, getWidgets } from '../services/widget.service';
import CalendarWidget from '../widgets/calendar/CalendarWidget';
import { IWidgetConfig } from '../widgets/IWidgetConfig';
import RSSWidget from '../widgets/rss/RSSWidget';
import StravaWidget from '../widgets/strava/StravaWidget';
import WeatherWidget from '../widgets/weather/WeatherWidget';
import TabPanel from '@mui/lab/TabPanel';
import { handleError } from 'src/reducers/actions';

interface IProps {
  tabId: number;
  newWidget?: IWidgetConfig;
}

export default function TabDash(props: IProps): React.ReactElement {
  const [widgets, setWidgets] = useState<IWidgetConfig[]>([]);
  const activeTab = useSelector((state: IReducerState) => state.activeTab);
  const dispatch = useDispatch();
  const ERROR_MESSAGE_GET_WIDGETS = 'Erreur lors de la récupération des widgets.';
  const ERROR_MESSAGE_DELETE_WIDGET = "Erreur lors de la suppression d'un widget.";

  useEffect(() => {
    if (activeTab === props.tabId) {
      getWidgets(props.tabId)
        .then((response) => setWidgets(response.data))
        .catch((error: Error) => dispatch(handleError(error, ERROR_MESSAGE_GET_WIDGETS)));
    }
  }, [activeTab]);

  useEffect(() => {
    if (props.newWidget) {
      setWidgets(widgets.concat([props.newWidget]) as []);
    }
  }, [props.newWidget != null && props.newWidget.id]);

  function createWidget(widgetConfig: IWidgetConfig) {
    const widgetProps = {
      id: widgetConfig.id,
      tabId: widgetConfig.tab.id,
      ...widgetConfig.data,
      onDeleteButtonClicked: deleteWidgetFromDashboard
    };
    switch (widgetConfig.type) {
      case WidgetTypes.WEATHER:
        return <WeatherWidget {...widgetProps} />;
      case WidgetTypes.RSS:
        return <RSSWidget {...widgetProps} />;
      case WidgetTypes.CALENDAR:
        return <CalendarWidget {...widgetProps} />;
      case WidgetTypes.STRAVA:
        return <StravaWidget {...widgetProps} />;
      case WidgetTypes.STEAM:
        return <SteamWidget {...widgetProps} />;
      case WidgetTypes.TWITTER_TIMELINE:
        return <TwitterTimelineWidget {...widgetProps} />;
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
      .catch((error: Error) => dispatch(handleError(error, ERROR_MESSAGE_DELETE_WIDGET)));
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
