import axios from "axios";
import * as dayjs from 'dayjs';
import * as queryString from 'query-string';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Button } from 'reactstrap';
import ComponentWithDetail from 'src/components/detailComponent/ComponentWithDetail';
import { ITabState } from 'src/reducers/tabReducer';
import { ModeEnum } from '../../enums/ModeEnum';
import { updateWidgetData } from '../../services/WidgetService';
import logger from '../../utils/LogUtils';
import DeleteWidget from '../utils/DeleteWidget';
import StravaActivity from './activity/StravaActivity';
import EmptyStravaWidget from './emptyWidget/EmptyStravaWidget';
import { IActivity, IAthlete } from './IStrava';
import "./StravaWidget.scss";

interface IProps {
    id: number;
    clientId?: string;
    clientSecret?: string;
    tabId: number;
    onDeleteButtonClicked: (idWidget: number) => void;
}

export default function StravaWidget(props: IProps) {
    const [mode, setMode] = useState(ModeEnum.READ);
    const [clientId, setClientId] = useState(props.clientId);
    const [clientSecret, setClientSecret] = useState(props.clientSecret);
    const [activities, setActivities] = useState([])
    const [athlete, setAthlete] = useState<IAthlete>();
    const [token, setToken] = useState<string>();
    const [refreshToken, setRefreshToken] = useState<string>();
    const [tokenExpirationDate, setTokenExpirationDate] = useState<string>();
    const { search } = useLocation();
    const [refreshIntervalId, setRefreshIntervalId] = useState<NodeJS.Timeout>();
    const activeTab = useSelector((state: ITabState) => state.activeTab);

    const paginationActivities = 20;

    useEffect(() => {
        if (localStorage.getItem("strava_token")) {
            setToken(localStorage.getItem("strava_token")?.toString());
            setRefreshToken(localStorage.getItem("strava_refresh_token")?.toString())
            setTokenExpirationDate(localStorage.getItem("strava_token_expires_at")?.toString())
        }
        const values = queryString.parse(search)
        if (values && values.code) {
            const apiCode = values.code.toString();
            getToken(apiCode);
        }
        if (dayjs(tokenExpirationDate).isBefore(dayjs())) {
            refreshTokenFromApi();
        }
    }, [])

    useEffect(() => {
        if (token) {
            getAthleteData();
            getActivities();
        }
    }, [token]);

    useEffect(() => {
        if (activeTab === props.tabId.toString()) {
            setRefreshIntervalId(setInterval(getActivities, 1200000));
        } else if (refreshIntervalId) {
            clearInterval(refreshIntervalId);
        }
    }, [activeTab === props.tabId.toString()]);

    function onConfigSubmitted(updatedClientId: string, updatedClientSecret: string) {
        updateWidgetData(props.id, { clientId: updatedClientId, clientSecret: updatedClientSecret })
            .then(response => {
                setClientId(clientId);
                setClientSecret(clientSecret);
                refreshWidget();
                setMode(ModeEnum.READ);
            })
            .catch(error => {
                logger.error(error.message);
            })
    }

    function refreshWidget() {
        setActivities([]);
        getActivities();
    }

    function getToken(apiCode: string) {
        axios.post("https://www.strava.com/oauth/token",
            {
                "client_id": clientId,
                "client_secret": clientSecret,
                "code": apiCode,
                "grant_type": "authorization_code"
            }).then(response => {
                setToken(response.data.access_token)
                setAthlete(response.data.athlete);
                localStorage.setItem("strava_token", response.data.access_token);
                localStorage.setItem("strava_refresh_token", response.data.refresh_token);
                localStorage.setItem("strava_token_expires_at", response.data.expires_at);
            })
            .catch((error: Error) => {
                logger.error(error.message)
            })
    }

    function refreshTokenFromApi() {
        if (localStorage.getItem("strava_refresh_token")) {
            axios.post("https://www.strava.com/oauth/token",
                {
                    "client_id": clientId,
                    "client_secret": clientSecret,
                    "refresh_token": localStorage.getItem("strava_refresh_token"),
                    "grant_type": "refresh_token"
                }).then(response => {
                    setToken(response.data.access_token)
                    setAthlete(response.data.athlete);
                    localStorage.setItem("strava_token", response.data.access_token);
                    localStorage.setItem("strava_refresh_token", response.data.refresh_token);
                    localStorage.setItem("strava_token_expires_at", response.data.expires_at);
                })
                .catch((error: Error) => {
                    logger.error(error.message)
                })
        } else {
            logger.error("No refresh token");
        }

    }

    function getAthleteData() {
        axios.get("https://www.strava.com/api/v3/athlete",
            { headers: { "Authorization": `Bearer ${token}` } }
        )
            .then(response => {
                setAthlete(response.data);
            })
            .catch((error: Error) => {
                logger.error(error.message)
            })
    }

    function getActivities() {
        if (token && dayjs(tokenExpirationDate).isBefore(dayjs())) {
            axios.get(`https://www.strava.com/api/v3/athlete/activities?page=1&per_page=${paginationActivities}`,
                { headers: { "Authorization": `Bearer ${token}` } }
            )
                .then(response => {
                    setActivities(response.data)
                })
                .catch(error => {
                    logger.error(error.message)
                })
        } else {
            refreshTokenFromApi();
        }
    }

    function editWidget() {
        setMode(ModeEnum.EDIT);
    }

    function cancelDeletion() {
        setMode(ModeEnum.READ);
    }

    function deleteWidget() {
        setMode(ModeEnum.DELETE);
    }

    return (

        <div>
            {clientId && clientSecret && mode === ModeEnum.READ
                ?
                <div>
                    <div className="header">
                        <div className="leftGroup widgetHeader">
                            <a href={`https://www.strava.com/athletes/${athlete?.id}`}>
                                <img src={athlete?.profile_medium} />
                                {athlete?.firstname} {athlete?.lastname}
                            </a>
                        </div>
                        <div className="rightGroup">
                            <button onClick={editWidget} className="btn btn-default editButton"><i className="fa fa-cog" aria-hidden="true" /></button>
                            <button onClick={refreshWidget} className="btn btn-default refreshButton"><i className="fa fa-refresh" aria-hidden="true" /></button>
                            <button onClick={deleteWidget} className="btn btn-default deleteButton"><i className="fa fa-trash" aria-hidden="true" /></button>
                        </div>
                    </div>
                    <div className="flexColumn">
                        <div style={{ flex: "1 0 50%", overflowY: "scroll" }}>
                            {
                                activities.map((activity: IActivity) => {
                                    return (
                                        <ComponentWithDetail key={activity.id} componentRoot={`${(dayjs(new Date(activity.start_date_local)).format("ddd DD MMM"))}  ${activity.name}  ${Math.round(activity.distance * 1000) / 1000000} kms`} componentDetail={<StravaActivity {...activity} />} link={`https://www.strava.com/activities/${activity.id}`} />
                                    )
                                })
                            }
                        </div>

                        <div style={{ minHeight: "25vh", flex: "1 0 50%" }}>
                            <Line data={{
                                labels: activities.reverse().map((activity: IActivity) => dayjs(activity.start_date_local).format('DD MMM')),
                                datasets: [
                                    {
                                        label: 'Course',
                                        borderColor: 'orange',
                                        data: activities.map((activity: IActivity) => Math.round(activity.distance * 1000) / 1000000)
                                    }
                                ]
                            }}
                                options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>

                    {!token && !refreshToken &&
                        <Button>
                            <a href={`https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${process.env.REACT_APP_FRONTEND_URL}&response_type=code&scope=read,activity:read`}>Se connecter</a>
                        </Button>
                    }

                </div>
                : (mode === ModeEnum.DELETE)
                    ? <DeleteWidget idWidget={props.id} onDeleteButtonClicked={props.onDeleteButtonClicked} onCancelButtonClicked={cancelDeletion} />
                    : <EmptyStravaWidget clientId={clientId} clientSecret={clientSecret} onConfigSubmitted={onConfigSubmitted} />
            }
        </div>
    )
}