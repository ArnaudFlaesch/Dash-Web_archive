import Calendar from '@toast-ui/react-calendar';
import axios from 'axios';
import * as ical from 'ical';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ICalendarInfo, ISchedule } from 'tui-calendar';
import { updateWidgetData } from '../../services/WidgetService';
import logger from '../../utils/LogUtils';
import Widget from '../Widget';
import './CalendarWidget.scss';
import EmptyCalendarWidget from './emptyWidget/EmptyCalendarWidget';

export interface IProps {
  id: number;
  calendars?: string[];
  isOnActiveTab: boolean;
  tabId: number;
  onDeleteButtonClicked: (idWidget: number) => void;
}

export default function CalendarWidget(props: IProps) {
  const [calendarUrls, setCalendarUrls] = useState(props.calendars);
  const [calendars, setCalendars] = useState<ICalendarInfo[]>([]);
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [selectedView, setSelectedView] = useState('week');
  const calendarRef = React.useRef<Calendar>(null);

  useEffect(() => {
    refreshWidget();
  }, [calendarUrls]);

  useEffect(() => {
    calendarRef.current?.getInstance().scrollToNow();
  }, [calendars]);

  function refreshWidget() {
    setCalendars([]);
    setSchedules([]);
    calendarUrls?.map((calendarUrl: string, index: number) => {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/proxy/?url=${calendarUrl}`)
        .then((response) => {
          const calendarId = index.toString();
          const newCalendar = {
            id: calendarId,
            name: calendarUrl.substring(0, 10),
            color: 'blue',
            borderColor: 'blue'
          };
          const cals = index > 0 ? calendars : [];
          setCalendars([...cals, newCalendar]);
          if (calendarRef.current?.getInstance().getViewName() !== 'month') {
            calendarRef.current?.getInstance().scrollToNow();
          }
          const data = ical.parseICS(response.data);
          const scheds = index > 0 ? schedules : [];
          setSchedules([
            ...scheds,
            ...Object.keys(data).map((eventKey) => {
              if (
                Object.prototype.hasOwnProperty.call(data, "eventKey") &&
                data[eventKey].type === 'VEVENT'
              ) {
                const event = data[eventKey];
                const newSchedule: ISchedule = {
                  calendarId,
                  title: event.summary,
                  start: event.start?.toISOString(),
                  end: event.end?.toISOString(),
                  location: event.location,
                  category:
                    event.end?.getHours() === 0 && event.start?.getHours() === 0
                      ? 'allday'
                      : 'time'
                };
                return newSchedule;
              } else {
                return {};
              }
            })
          ]);
        })
        .catch((error) => {
          logger.error(error);
        });
    });
  }

  function onConfigSubmitted(updatedCalendars: string[]) {
    updateWidgetData(props.id, { calendars: updatedCalendars })
      .then((response) => {
        setCalendarUrls(updatedCalendars);
      })
      .catch((error) => {
        logger.error(error.message);
      });
  }

  function setCalendarOnToday() {
    if (calendarRef && calendarRef.current) {
      const calendarInstance = calendarRef.current.getInstance();
      calendarInstance.today();
    }
  }

  function previousRange() {
    if (calendarRef && calendarRef.current) {
      const calendarInstance = calendarRef.current.getInstance();
      calendarInstance.prev();
    }
  }

  function nextRange() {
    if (calendarRef && calendarRef.current) {
      const calendarInstance = calendarRef.current.getInstance();
      calendarInstance.next();
    }
  }

  function toggleViewDay() {
    setSelectedView('day');
  }

  function toggleViewWeek() {
    setSelectedView('week');
  }

  function toggleViewMonth() {
    setSelectedView('month');
  }

  const widgetHeader = <div>Calendar</div>;

  const widgetBody = (
    <div>
      <div id="calendarMenu">
        <span id="menu-navi">
          <button
            onClick={setCalendarOnToday}
            className="btn btn-default btn-sm move-today"
            data-action="move-today"
          >
            Today
          </button>
          <button
            onClick={previousRange}
            className="btn btn-default btn-sm move-day"
            data-action="move-prev"
          >
            <i
              className="tui-full-calendar-icon tui-full-calendar-ic-arrow-left"
              data-action="move-prev"
            />
          </button>
          <button
            onClick={nextRange}
            className="btn btn-default btn-sm move-day"
            data-action="move-next"
          >
            <i
              className="tui-full-calendar-icon tui-full-calendar-ic-arrow-right"
              data-action="move-next"
            />
          </button>
        </span>
        <span id="renderRange" className="render-range">
          {calendarRef.current
            ?.getInstance()
            .getDateRangeStart()
            .toDate()
            .toLocaleDateString('fr')}
          -{' '}
          {calendarRef.current
            ?.getInstance()
            .getDateRangeEnd()
            .toDate()
            .toLocaleDateString('fr')}
        </span>
        <button
          onClick={toggleViewDay}
          className={`btn btn-${
            selectedView === 'day' ? 'primary' : 'default'
          }`}
        >
          Jour
        </button>
        <button
          onClick={toggleViewWeek}
          className={`btn btn-${
            selectedView === 'week' ? 'primary' : 'default'
          }`}
        >
          Semaine
        </button>
        <button
          onClick={toggleViewMonth}
          className={`btn btn-${
            selectedView === 'month' ? 'primary' : 'default'
          }`}
        >
          Mois
        </button>
      </div>

      <Calendar
        ref={calendarRef}
        height="inherit"
        calendars={calendars}
        disableDblClick={true}
        disableClick={false}
        isReadOnly={false}
        month={{
          startDayOfWeek: 1,
          daynames: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
        }}
        schedules={schedules}
        scheduleView={true}
        taskView={true}
        template={{
          milestone(schedule) {
            return `<span style="color:#fff;background-color: ${schedule.bgColor};">${schedule.title}</span>`;
          },
          milestoneTitle() {
            return 'Milestone';
          },
          allday(schedule) {
            return `${schedule.title}<i class="fa fa-refresh"></i>`;
          },
          alldayTitle() {
            return 'All Day';
          }
        }}
        useDetailPopup={true}
        useCreationPopup={true}
        view={selectedView}
        defaultView="week"
        week={{
          startDayOfWeek: 1,
          hourStart: 8,
          daynames: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
          showTimezoneCollapseButton: true,
          timezonesCollapsed: true
        }}
      />
    </div>
  );

  return (
    <div>
      <Widget
        id={props.id}
        tabId={props.tabId}
        config={{ calendarUrls: calendarUrls }}
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
