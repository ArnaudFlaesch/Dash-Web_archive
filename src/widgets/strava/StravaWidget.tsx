import axios from "axios";
import * as queryString from 'query-string';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from 'reactstrap';
import { ModeEnum } from '../../enums/ModeEnum';
import { updateWidgetData } from '../../services/WidgetService';
import logger from '../../utils/LogUtils';
import DeleteWidget from '../utils/DeleteWidget';
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
    const [token, setToken] = useState();
    const { search } = useLocation();
    // const activeTab = useSelector((state: ITabState) => state.activeTab);

    useEffect(() => {
        const values = queryString.parse(search)
        if (values && values.code) {
            const apiCode = values.code.toString();
            getToken(apiCode);
        }
    }, [])

    useEffect(() => {
        if (token) {
            getActivities()
        }
        logger.info(token)
    }, [token]);

    function onConfigSubmitted(updatedClientId: string, updatedClientSecret: string) {
        updateWidgetData(props.id, { clientId: updatedClientId, clientSecret: updatedClientSecret })
            .then(response => {
                setClientId(clientId);
                setClientSecret(clientSecret);
                // refreshWidget();
                setMode(ModeEnum.READ);
            })
            .catch(error => {
                logger.error(error.message);
            })
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
                logger.info(response.data)
            })
            .catch((error: Error) => {
                logger.error(error.message)
            })
    }

    function getActivities() {
        axios.get("https://www.strava.com/api/v3/athlete/activities?page=1&per_page=56",
            { headers: { "Authorization": `Bearer ${token}` } }
        ).then(response => {
            logger.info(response)
            setActivities(response.data)
        })
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
                            <button onClick={deleteWidget} className="btn btn-default deleteButton"><i className="fa fa-trash" aria-hidden="true" /></button>
                        </div>
                    </div>
                    <div>
                        {
                            activities.map((activity: IActivity) => {
                                return (
                                    <div key={activity.id}>
                                        <div>
                                            {activity.name}
                                        </div>
                                        <div>
                                            {Math.round(activity.distance * 1000) / 1000000} kms
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>

                    {!token &&
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