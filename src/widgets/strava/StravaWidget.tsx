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
import { useLocalStorage } from 'src/hooks/localStorageHook';

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
    const [token, setToken] = useLocalStorage('strava_token', null);
    const [refreshToken, setRefreshToken] = useLocalStorage('strava_refresh_token', null);
    const [tokenExpirationDate, setTokenExpirationDate] = useLocalStorage('strava_token_expires_at', null);
    const { search } = useLocation();

    const paginationActivities = 20;

    useEffect(() => {
        const values = queryString.parse(search)
        if (values && values.code) {
            const apiCode = values.code.toString();
            getToken(apiCode);
        }
        if (!token || !refreshToken || dayjs.unix(tokenExpirationDate).isBefore(dayjs())) {
            refreshTokenFromApi();
        }
    }, [])

    useEffect(() => {
        if (token) {
            refreshWidget();
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
        getAthleteData();
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
                setToken(response.data.access_token);
                setRefreshToken(response.data.refresh_token);
                setTokenExpirationDate(response.data.expires_at);
                setAthlete(response.data.athlete);
            })
            .catch((error: Error) => {
                logger.error(error.message)
            })
    }

    function refreshTokenFromApi() {
        if (refreshToken) {
            axios.post("https://www.strava.com/oauth/token",
                {
                    "client_id": clientId,
                    "client_secret": clientSecret,
                    "refresh_token": refreshToken,
                    "grant_type": "refresh_token"
                }).then(response => {
                    setToken(response.data.access_token);
                    setRefreshToken(response.data.refresh_token);
                    setTokenExpirationDate(response.data.expires_at);
                    setAthlete(response.data.athlete);
                })
                .catch((error: Error) => {
                    logger.error(error.message)
                })
        } else {
            logger.error("No refresh token");
        }

    }

    function getAthleteData() {
        if (token) {
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

    }

    function getActivities() {
        logger.info(tokenExpirationDate)
        if (token && tokenExpirationDate && dayjs.unix(tokenExpirationDate).isAfter(dayjs())) {
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

            {
                (!token || !refreshToken || tokenExpirationDate && dayjs.unix(tokenExpirationDate).isBefore(dayjs())) &&
                <a href={`https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${process.env.REACT_APP_FRONTEND_URL}&response_type=code&scope=read,activity:read`}>
                    <Button>
                        Se connecter
                    </Button>
                </a>
            }
        </div>

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