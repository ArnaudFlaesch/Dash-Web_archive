import axios from 'axios';
import * as ical from 'ical';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { updateWidgetData } from '../../services/WidgetService';
import logger from '../../utils/LogUtils';
import Widget from '../Widget';
import './CalendarWidget.scss';
import EmptyCalendarWidget from './emptyWidget/EmptyCalendarWidget';
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import { fr } from "date-fns/locale";

import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';

export interface IProps {
  id: number;
  calendars?: string[];
  tabId: number;
  onDeleteButtonClicked: (idWidget: number) => void;
}

export default function CalendarWidget(props: IProps): React.ReactElement {
  const [calendarUrls, setCalendarUrls] = useState(props.calendars);
  const [schedules, setSchedules] = useState<Event[]>([]);

  const locales = {
    'fr': fr,
  }
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  })

  useEffect(() => {
    refreshWidget();
  }, [calendarUrls]);

  function onConfigSubmitted(updatedCalendars: string[]) {
    updateWidgetData(props.id, { calendars: updatedCalendars })
      .then(() => {
        // Reset des URL pour pouvoir re-trigger le mode READ du widget via le changement de config.
        setCalendarUrls([]);
        setCalendarUrls(updatedCalendars);
      })
      .catch((error) => {
        logger.error(error.message);
      });
  }

  function refreshWidget() {
    setSchedules([]);
    calendarUrls?.map((calendarUrl: string, index: number) => {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/proxy/?url=${calendarUrl}`)
        .then((response) => {
          const data = ical.parseICS(response.data);
          const scheds = index > 0 ? schedules : [];
          setSchedules([
            ...scheds,
            ...Object.keys(data).map((eventKey) => {
              const event = data[eventKey];
              const newSchedule: Event = {
                title: event.summary,
                start: event.start,
                end: event.end,
                allDay: event.end?.getHours() === 0 && event.start?.getHours() === 0
              };
              return newSchedule;
            })
          ]);
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
        culture={"fr"}
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
    <div>
      <Widget
        id={props.id}
        tabId={props.tabId}
        config={{ calendars: calendarUrls }}
        header={widgetHeader}
        body={widgetBody}
        editModeComponent={
          <EmptyCalendarWidget
            calendarUrls={calendarUrls}
            onConfigSubmitted={onConfigSubmitted}
          />
        }
        refreshFunction={refreshWidget}
        onDeleteButtonClicked={props.onDeleteButtonClicked}
      />
    </div>
  );
}
