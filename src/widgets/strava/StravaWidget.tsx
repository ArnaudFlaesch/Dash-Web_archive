import axios, { AxiosError } from 'axios';
import * as queryString from 'query-string';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ComponentWithDetail from '../../components/detailComponent/ComponentWithDetail';
import logger from '../../utils/LogUtils';
import Widget from '../Widget';
import StravaActivity from './activity/StravaActivity';
import { IActivity, IAthlete } from './IStrava';
import { format, isAfter, isBefore } from 'date-fns';
import { Chart } from 'react-chartjs-2';
import IBaseWidgetConfig from 'src/model/IBaseWidgetConfig';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import {
  Chart as ChartJS,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
} from 'chart.js';
import { handleError } from 'src/reducers/actions';

interface ITokenData {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  athlete: IAthlete;
}

export default function StravaWidget(props: IBaseWidgetConfig): React.ReactElement {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [athlete, setAthlete] = useState<IAthlete>();
  const { search } = useLocation();
  const dispatch = useDispatch();

  const STORAGE_STRAVA_TOKEN_KEY = 'strava_token';
  const STORAGE_STRAVA_REFRESH_TOKEN_KEY = 'strava_refresh_token';
  const STORAGE_TOKEN_EXPIRATION_DATE_KEY = 'strava_token_expires_at';

  const token = window.localStorage.getItem(STORAGE_STRAVA_TOKEN_KEY);
  const refreshToken = window.localStorage.getItem(STORAGE_STRAVA_REFRESH_TOKEN_KEY);
  const tokenExpirationDate = window.localStorage.getItem(STORAGE_TOKEN_EXPIRATION_DATE_KEY);

  const STRAVA_URL = 'https://www.strava.com';
  const STRAVA_LOGIN_URL = `${STRAVA_URL}/oauth/authorize?client_id=${process.env.REACT_APP_STRAVA_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_FRONTEND_URL}&response_type=code&scope=read,activity:read`;
  const STRAVA_API_AUTH = `${STRAVA_URL}/oauth/token`;
  const STRAVA_API = `${STRAVA_URL}/api/v3`;

  const ERROR_GETTING_TOKEN = 'Erreur lors de la connexion à Strava.';
  const ERROR_NO_REFRESH_TOKEN = "Vous n'êtes pas connecté à Strava.";
  const ERROR_GETTING_ATHLETE_DATA = 'Erreur lors de la récupération de vos informations.';
  const ERROR_GETTING_ACTIVITIES = 'Erreur lors de la récupération des activités.';

  const paginationActivities = 20;

  ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, LineElement, PointElement);

  useEffect(() => {
    const values = queryString.parse(search);
    if (values && values.code) {
      const apiCode = values.code.toString();
      getToken(apiCode);
    }
    if (!token || !refreshToken || isBefore(new Date((tokenExpirationDate as unknown as number) * 1000), new Date())) {
      refreshTokenFromApi();
    }
  }, []);

  useEffect(() => {
    if (token) {
      refreshWidget();
    }
  }, [token]);

  function refreshWidget() {
    setActivities([]);
    getAthleteData();
    getActivities();
  }

  function saveData(response: ITokenData) {
    window.localStorage.setItem(STORAGE_STRAVA_TOKEN_KEY, response.access_token);
    window.localStorage.setItem(STORAGE_STRAVA_REFRESH_TOKEN_KEY, response.refresh_token);
    window.localStorage.setItem(STORAGE_TOKEN_EXPIRATION_DATE_KEY, response.expires_at);
    setAthlete(response.athlete);
  }

  function getToken(apiCode: string) {
    axios
      .post<ITokenData>(STRAVA_API_AUTH, {
        client_id: process.env.REACT_APP_STRAVA_CLIENT_ID,
        client_secret: process.env.REACT_APP_STRAVA_CLIENT_SECRET,
        code: apiCode,
        grant_type: 'authorization_code'
      })
      .then((response) => saveData(response.data))
      .catch((error: Error) => dispatch(handleError(error, ERROR_GETTING_TOKEN)));
  }

  function refreshTokenFromApi() {
    if (refreshToken) {
      axios
        .post<ITokenData>(STRAVA_API_AUTH, {
          client_id: process.env.REACT_APP_STRAVA_CLIENT_ID,
          client_secret: process.env.REACT_APP_STRAVA_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token'
        })
        .then((response) => saveData(response.data))
        .catch((error: Error) => dispatch(handleError(error, ERROR_NO_REFRESH_TOKEN)));
    } else {
      logger.error('No refresh token');
    }
  }

  function getAthleteData() {
    if (token) {
      axios
        .get<IAthlete>(`${STRAVA_API}/athlete`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => setAthlete(response.data))
        .catch((error: Error) => dispatch(handleError(error, ERROR_GETTING_ATHLETE_DATA)));
    }
  }

  function getActivities() {
    if (
      token &&
      tokenExpirationDate &&
      isAfter(new Date((tokenExpirationDate as unknown as number) * 1000), new Date())
    ) {
      axios
        .get<IActivity[]>(`${STRAVA_API}/athlete/activities?page=1&per_page=${paginationActivities}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => setActivities(response.data.reverse()))
        .catch((error: AxiosError) => dispatch(handleError(error, ERROR_GETTING_ACTIVITIES)));
    } else {
      refreshTokenFromApi();
    }
  }

  function getActivitiesByMonth() {
    return activities.reduce((activitiesByMonth: IActivity[], activity: IActivity) => {
      const month = format(new Date(activity.start_date_local), 'yyyy-MM');
      if (!activitiesByMonth[month]) {
        activitiesByMonth[month] = [];
      }
      activitiesByMonth[month].push(Math.round(activity.distance * 1000) / 1000000);
      return activitiesByMonth;
    }, []);
  }

  function getStatsFromActivities() {
    const activitiesByMonthList = getActivitiesByMonth();
    return Object.keys(activitiesByMonthList).map((month) => {
      return {
        x: new Date(month),
        y: Math.round(activitiesByMonthList[month].reduce((total: number, distance: number) => total + distance))
      };
    });
  }

  const widgetHeader = (
    <div id="stravaWidgetHeader">
      <a href={`${STRAVA_URL}/athletes/${athlete?.id}`} className="flex flex-row">
        <img className="h-9 w-9" src={athlete?.profile_medium} />
        <p>
          {athlete?.firstname} {athlete?.lastname}
        </p>
      </a>
    </div>
  );

  function getTitleToDisplay(activity: IActivity): string {
    return `${format(new Date(activity.start_date_local), 'dd MMM')}  ${activity.name}  ${
      Math.round(activity.distance * 1000) / 1000000
    } kms`;
  }

  const widgetBody = (
    <div className="flex flex-col">
      {token &&
        refreshToken &&
        tokenExpirationDate &&
        isAfter(new Date((tokenExpirationDate as unknown as number) * 1000), new Date()) && (
          <div>
            <div className="max-h-48 overflow-y-scroll">
              {activities
                .slice()
                .reverse()
                .map((activity: IActivity, index: number) => {
                  return (
                    <ComponentWithDetail
                      key={activity.id}
                      componentRoot={
                        <div className={`${index % 2 ? 'bg-gray-200' : ''} stravaActivity`}>
                          {getTitleToDisplay(activity)}
                        </div>
                      }
                      componentDetail={<StravaActivity {...activity} />}
                      link={`${STRAVA_URL}/activities/${activity.id}`}
                    />
                  );
                })}
            </div>

            <div className="min-h-24 max-h-96">
              <Chart
                type="bar"
                data={{
                  labels: getStatsFromActivities().map((data) => format(data.x, 'MMM yyyy')),
                  datasets: [
                    {
                      label: 'Distance (kms)',
                      backgroundColor: 'orange',
                      data: getStatsFromActivities().map((act) => act.y),
                      yAxisID: 'kms',
                      order: 2
                    },
                    {
                      label: 'Activités',
                      type: 'line',
                      backgroundColor: 'darkgreen',
                      data: Object.keys(getActivitiesByMonth()).map((month) => getActivitiesByMonth()[month].length),
                      yAxisID: 'activities',
                      order: 1
                    }
                  ]
                }}
              />
            </div>
          </div>
        )}
      {(!token ||
        !refreshToken ||
        (tokenExpirationDate && isBefore(new Date((tokenExpirationDate as unknown as number) * 1000), new Date()))) && (
        <a href={STRAVA_LOGIN_URL}>
          <Button variant="contained">Se connecter</Button>
        </a>
      )}
    </div>
  );

  return (
    <Widget
      id={props.id}
      tabId={props.tabId}
      config={new Map()}
      header={widgetHeader}
      body={widgetBody}
      refreshFunction={refreshWidget}
      onDeleteButtonClicked={props.onDeleteButtonClicked}
    />
  );
}
