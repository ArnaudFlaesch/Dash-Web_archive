import axios from "axios";
import * as dayjs from 'dayjs';
import * as queryString from 'query-string';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';
import { Button } from 'reactstrap';
import ComponentWithDetail from '../../components/detailComponent/ComponentWithDetail';
import { updateWidgetData } from '../../services/WidgetService';
import logger from '../../utils/LogUtils';
import Widget from '../Widget';
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
    const [clientId, setClientId] = useState(props.clientId);
    const [clientSecret, setClientSecret] = useState(props.clientSecret);
    const [activities, setActivities] = useState([])
    const [athlete, setAthlete] = useState<IAthlete>();
    const [token, setToken] = useState<string>();
    const [refreshToken, setRefreshToken] = useState<string>();
    const [tokenExpirationDate, setTokenExpirationDate] = useState<string>();
    const { search } = useLocation();

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


    function onConfigSubmitted(updatedClientId: string, updatedClientSecret: string) {
        updateWidgetData(props.id, { clientId: updatedClientId, clientSecret: updatedClientSecret })
            .then(response => {
                setClientId(clientId);
                setClientSecret(clientSecret);
                refreshWidget();
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

    const widgetHeader =
        <div>
            <a href={`https://www.strava.com/athletes/${athlete?.id}`}>
                <img src={athlete?.profile_medium} />
                {athlete?.firstname} {athlete?.lastname}
            </a>
        </div>

    const widgetBody =
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

    {
        !token && !refreshToken &&
        <Button>
            <a href={`https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${process.env.REACT_APP_FRONTEND_URL}&response_type=code&scope=read,activity:read`}>Se connecter</a>
        </Button>
    }

    return (
        <div>
            <Widget id={props.id} tabId={props.tabId}
                config={{ "clientId": clientId }}
                header={widgetHeader}
                body={widgetBody}
                editModeComponent={<EmptyStravaWidget clientId={clientId} clientSecret={clientSecret} onConfigSubmitted={onConfigSubmitted} />}
                refreshFunction={refreshWidget}
                onDeleteButtonClicked={props.onDeleteButtonClicked} />
        </div>
    )
}