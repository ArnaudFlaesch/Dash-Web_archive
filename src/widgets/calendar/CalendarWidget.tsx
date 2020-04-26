import bootstrap from '@fullcalendar/bootstrap';
import { OptionsInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import axios from 'axios';
import * as ical from 'ical';
import * as React from 'react';
import './CalendarWidget.scss';

export interface IProps {
    calendars: string[]
}

export default class CalendarWidget extends React.Component<any, any> {

    private calendarOptions: OptionsInput = {
        firstDay: 1,
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridMonth,timeGridDay,listMonth'
        },
        weekNumbers: true,
    }

    public constructor(props: IProps) {
        super(props);
        this.state = {
            events: []
        }
    }

    public componentDidMount() {
        this.props.calendars.map((calendarUrl: string) => {
            axios.get('https://cors-anywhere.herokuapp.com/' + calendarUrl)
                .then((response) => {
                    const data = ical.parseICS(response.data);
                    this.setState({
                        events: this.state.events.concat(Object.keys(data).map((eventKey) => {
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
                        }))
                    });
                });
        })

    }

    public render() {
        return (
            <div className="widget">
                <FullCalendar {...this.calendarOptions} defaultView="dayGridMonth" events={this.state?.events}
                    plugins={[bootstrap, dayGridPlugin, interactionPlugin, listPlugin, timeGridPlugin]} themeSystem={'bootstrap'} />
            </div>
        )
    }
}