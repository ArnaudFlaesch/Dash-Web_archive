import axios from 'axios';
import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import { fr } from 'date-fns/locale';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import * as ical from 'ical';
import { ReactElement, useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import IBaseWidgetConfig from 'src/model/IBaseWidgetConfig';
import authorizationBearer from 'src/services/auth.header';
import { updateWidgetData } from '../../services/widget.service';
import logger from '../../utils/LogUtils';
import Widget from '../Widget';
import './CalendarWidget.scss';
import EmptyCalendarWidget from './emptyWidget/EmptyCalendarWidget';

export interface IProps extends IBaseWidgetConfig {
  calendars?: string[];
}

export default function CalendarWidget(props: IProps): ReactElement {
  const [calendarUrls, setCalendarUrls] = useState(props.calendars);
  const [schedules, setSchedules] = useState<Event[]>([]);

  const locales = {
    fr: fr
  };
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
  });

  useEffect(() => {
    refreshWidget();
  }, [calendarUrls]);

  function onConfigSubmitted(updatedCalendars: string[]) {
    updateWidgetData(props.id, { calendars: updatedCalendars })
      .then(() => {
        if (updatedCalendars === calendarUrls) {
          refreshWidget();
        }
        setCalendarUrls(updatedCalendars);
      })
      .catch((error) => {
        logger.error(error.message);
      });
  }

  function refreshWidget() {
    setSchedules([]);
    calendarUrls?.map((calendarUrl: string) => {
      axios
        .get<string>(`${process.env.REACT_APP_BACKEND_URL}/proxy/?url=${calendarUrl}`, {
          headers: {
            Authorization: authorizationBearer(),
            'Content-type': 'application/json'
          }
        })
        .then((response) => {
          const data = ical.parseICS(response.data);
          setSchedules((oldSchedules) =>
            oldSchedules.concat(
              ...Object.keys(data).map((eventKey) => {
                const event = data[eventKey];
                return {
                  title: event.summary,
                  start: event.start,
                  end: event.end,
                  allDay: event.end?.getHours() === 0 && event.start?.getHours() === 0
                };
              })
            )
          );
        })
        .catch((error) => {
          logger.error(error);
        });
    });
  }

  const widgetHeader = <div>Calendar</div>;

  const widgetBody = (
    <div>
      <Calendar
        localizer={localizer}
        culture={'fr'}
        events={schedules}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        popup={true}
        style={{ height: 500 }}
      />
    </div>
  );

  return (
    <Widget
      id={props.id}
      tabId={props.tabId}
      config={{ calendars: calendarUrls }}
      header={widgetHeader}
      body={widgetBody}
      editModeComponent={<EmptyCalendarWidget calendarUrls={calendarUrls} onConfigSubmitted={onConfigSubmitted} />}
      refreshFunction={refreshWidget}
      onDeleteButtonClicked={props.onDeleteButtonClicked}
    />
  );
}
