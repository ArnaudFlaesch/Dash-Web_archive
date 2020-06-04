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
import { ModeEnum } from '../../enums/ModeEnum';
import logger from '../../utils/LogUtils';
import DeleteWidget from '../utils/DeleteWidget';
import './CalendarWidget.scss';

export interface IProps {
    id: number;
    calendars?: string[];
    onDeleteButtonClicked: (idWidget: number) => void;
}

export interface IState {
    id: number;
    events: any[];
    mode: ModeEnum;
}

export default class CalendarWidget extends React.Component<IProps, IState> {

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
            id: this.props.id,
            events: [],
            mode: ModeEnum.READ
        }
        this.editWidget = this.editWidget.bind(this);
        this.cancelDeletion = this.cancelDeletion.bind(this);
        this.deleteWidget = this.deleteWidget.bind(this);
    }

    public componentDidMount() {
        this.props.calendars?.map((calendarUrl: string) => {
            axios.get(`${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/proxy?url=${calendarUrl}`)
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
                })
                .catch(error => {
                    logger.error(error);
                });
        })
    }

    public editWidget(): void {
        this.setState({ mode: ModeEnum.EDIT });
    }

    public cancelDeletion() {
        this.setState({ mode: ModeEnum.READ });
    }

    public deleteWidget() {
        this.setState({ mode: ModeEnum.DELETE });
    }

    public render() {
        return (
            <div>
                {this.state.events && this.state.mode === ModeEnum.READ
                    ?
                    <div>
                        <div className="header">
                            <div className="leftGroup widgetHeader">
                                Calendar
							</div>
                            <div className="rightGroup">
                                <button onClick={this.editWidget} className="btn btn-default editButton"><i className="fa fa-cog" aria-hidden="true" /></button>
                                <button className="btn btn-default refreshButton"><i className="fa fa-refresh" aria-hidden="true" /></button>
                                <button onClick={this.deleteWidget} className="btn btn-default deleteButton"><i className="fa fa-trash" aria-hidden="true" /></button>
                            </div>
                        </div>
                        <FullCalendar {...this.calendarOptions} defaultView="dayGridMonth" events={this.state?.events}
                            plugins={[bootstrap, dayGridPlugin, interactionPlugin, listPlugin, timeGridPlugin]} themeSystem={'bootstrap'} />
                    </div>
                    : (this.state.mode === ModeEnum.DELETE)
                        ? <DeleteWidget idWidget={this.props.id} onDeleteButtonClicked={this.props.onDeleteButtonClicked} onCancelButtonClicked={this.cancelDeletion} />
                        : <div />
                }
            </div>
        )
    }
}