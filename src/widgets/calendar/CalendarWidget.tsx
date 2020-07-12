import FullCalendar, { CalendarOptions } from '@fullcalendar/react';
import bootstrap from '@fullcalendar/bootstrap';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import axios from 'axios';
import * as ical from 'ical';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ModeEnum } from '../../enums/ModeEnum';
import { updateWidgetData } from '../../services/WidgetService';
import logger from '../../utils/LogUtils';
import DeleteWidget from '../utils/DeleteWidget';
import './CalendarWidget.scss';
import EmptyCalendarWidget from './emptyWidget/EmptyCalendarWidget';
import frLocale from '@fullcalendar/core/locales/fr';

export interface IProps {
    id: number;
    calendars?: string[];
    isOnActiveTab: boolean;
    onDeleteButtonClicked: (idWidget: number) => void;
}

export default function CalendarWidget(props: IProps) {
    const [events, setEvents] = useState<any[]>([]);
    const [mode, setMode] = useState(ModeEnum.READ);
    const [calendarUrls, setCalendarUrls] = useState(props.calendars);

    const calendarOptions: CalendarOptions = {
        firstDay: 1,
        headerToolbar: {
            start: 'prev,next today',
            center: 'title',
            end: 'dayGridMonth,timeGridMonth,timeGridDay,listMonth'
        },
        weekNumbers: true,
    }

    useEffect(() => {
        calendarUrls?.map((calendarUrl: string) => {
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/proxy/?url=${calendarUrl}`)
                .then((response) => {
                    const data = ical.parseICS(response.data);
                    setEvents(events.concat(Object.keys(data).map((eventKey) => {
                        if (data.hasOwnProperty(eventKey) && data[eventKey].type === 'VEVENT') {
                            const event = data[eventKey];
                            return {
                                title: event.summary, start: event.start,
                                end: event.end, location: event.location,
                                eventBackgroundColor: 'green'
                            }
                        } else {
                            return {};
                        }
                    })))
                })
                .catch(error => {
                    logger.error(error);
                });
        })
    }, [calendarUrls])

    const onConfigSubmitted = (calendars: string[]) => {
		updateWidgetData(props.id, { calendars })
			.then(response => {
				setCalendarUrls(calendars);
				setMode(ModeEnum.READ);
			})
			.catch(error => {
				logger.error(error.message);
			})
	}

    const editWidget = () => {
        setEvents([]);
        setMode(ModeEnum.EDIT);
    }

    const cancelDeletion = () => {
        setMode(ModeEnum.READ);
    }

    const deleteWidget = () => {
        setMode(ModeEnum.DELETE);
    }

    return (
        <div>
            {events && mode === ModeEnum.READ
                ?
                <div>
                    <div className="header">
                        <div className="leftGroup widgetHeader">
                            Calendar
							</div>
                        <div className="rightGroup">
                            <button onClick={editWidget} className="btn btn-default editButton"><i className="fa fa-cog" aria-hidden="true" /></button>
                            <button className="btn btn-default refreshButton"><i className="fa fa-refresh" aria-hidden="true" /></button>
                            <button onClick={deleteWidget} className="btn btn-default deleteButton"><i className="fa fa-trash" aria-hidden="true" /></button>
                        </div>
                    </div>
                    <FullCalendar locale={ frLocale } {...calendarOptions} initialView="dayGridMonth" events={events}
                        plugins={[bootstrap, dayGridPlugin, interactionPlugin, listPlugin, timeGridPlugin]} themeSystem={'bootstrap'} />
                </div>
                : (mode === ModeEnum.DELETE)
                    ? <DeleteWidget idWidget={props.id} onDeleteButtonClicked={props.onDeleteButtonClicked} onCancelButtonClicked={cancelDeletion} />
                    : <EmptyCalendarWidget calendarUrls={calendarUrls} onConfigSubmitted={onConfigSubmitted} />
            }
        </div>
    )
}