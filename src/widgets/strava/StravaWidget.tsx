import axios from 'axios';
import * as queryString from 'query-string';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from 'reactstrap';
import ComponentWithDetail from '../../components/detailComponent/ComponentWithDetail';
import { useLocalStorage } from '../../hooks/localStorageHook';
import logger from '../../utils/LogUtils';
import Widget from '../Widget';
import StravaActivity from './activity/StravaActivity';
import { IActivity, IAthlete } from './IStrava';
import { format, isAfter, isBefore } from 'date-fns';
import ChartComponent from 'react-chartjs-2';

interface IProps {
  id: number;
  tabId: number;
  onDeleteButtonClicked: (idWidget: number) => void;
}

export default function StravaWidget(props: IProps): React.ReactElement {
  const [activities, setActivities] = useState([]);
  const [athlete, setAthlete] = useState<IAthlete>();
  const [token, setToken] = useLocalStorage('strava_token', null);
  const [refreshToken, setRefreshToken] = useLocalStorage(
    'strava_refresh_token',
    null
  );
  const [tokenExpirationDate, setTokenExpirationDate] = useLocalStorage(
    'strava_token_expires_at',
    null
  );
  const { search } = useLocation();

  const paginationActivities = 20;

  useEffect(() => {
    const values = queryString.parse(search);
    if (values && values.code) {
      const apiCode = values.code.toString();
      getToken(apiCode);
    }
    if (
      !token ||
      !refreshToken ||
      isBefore(new Date((tokenExpirationDate as number) * 1000), new Date())
    ) {
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

  function getToken(apiCode: string) {
    axios
      .post('https://www.strava.com/oauth/token', {
        client_id: process.env.REACT_APP_STRAVA_CLIENT_ID,
        client_secret: process.env.REACT_APP_STRAVA_CLIENT_SECRET,
        code: apiCode,
        grant_type: 'authorization_code'
      })
      .then((response) => {
        setToken(response.data.access_token as string);
        setRefreshToken(response.data.refresh_token);
        setTokenExpirationDate(response.data.expires_at);
        setAthlete(response.data.athlete);
      })
      .catch((error: Error) => {
        logger.error(error.message);
      });
  }

  function refreshTokenFromApi() {
    if (refreshToken) {
      axios
        .post('https://www.strava.com/oauth/token', {
          client_id: process.env.REACT_APP_STRAVA_CLIENT_ID,
          client_secret: process.env.REACT_APP_STRAVA_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token'
        })
        .then((response) => {
          setToken(response.data.access_token);
          setRefreshToken(response.data.refresh_token);
          setTokenExpirationDate(response.data.expires_at);
          setAthlete(response.data.athlete);
        })
        .catch((error: Error) => {
          logger.error(error.message);
        });
    } else {
      logger.error('No refresh token');
    }
  }

  function getAthleteData() {
    if (token) {
      axios
        .get('https://www.strava.com/api/v3/athlete', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
          setAthlete(response.data);
        })
        .catch((error: Error) => {
          logger.error(error.message);
        });
    }
  }

  function getActivities() {
    if (
      token &&
      tokenExpirationDate &&
      isAfter(new Date((tokenExpirationDate as number) * 1000), new Date())
    ) {
      axios
        .get(
          `https://www.strava.com/api/v3/athlete/activities?page=1&per_page=${paginationActivities}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          setActivities(response.data.reverse());
        })
        .catch((error) => {
          logger.error(error.message);
        });
    } else {
      refreshTokenFromApi();
    }
  }

  function getActivitiesByMonth() {
    return activities.reduce(
      (activitiesByMonth: IActivity[], activity: IActivity) => {
        const month = format(new Date(activity.start_date_local), 'yyyy-MM');
        if (!activitiesByMonth[month]) {
          activitiesByMonth[month] = [];
        }
        activitiesByMonth[month].push(
          Math.round(activity.distance * 1000) / 1000000
        );
        return activitiesByMonth;
      },
      []
    );
  }

  function getStatsFromActivities() {
    const activitiesByMonthList = getActivitiesByMonth();
    return Object.keys(activitiesByMonthList).map((month) => {
      return {
        x: new Date(month),
        y: Math.round(
          activitiesByMonthList[month].reduce(
            (total: number, distance: number) => total + distance
          )
        )
      };
    });
  }

  const widgetHeader = (
    <div>
      <a
        href={`https://www.strava.com/athletes/${athlete?.id}`}
        className="flex flex-row"
      >
        <img src={athlete?.profile_medium} />
        <p>
          {athlete?.firstname} {athlete?.lastname}
        </p>
      </a>
    </div>
  );

  const widgetBody = (
    <div className="flex flex-column">
      {token &&
        refreshToken &&
        tokenExpirationDate &&
        isAfter(
          new Date((tokenExpirationDate as number) * 1000),
          new Date()
        ) && (
          <div>
            <div style={{ height: '20vh', overflowY: 'scroll' }}>
              {activities
                .slice()
                .reverse()
                .map((activity: IActivity) => {
                  return (
                    <ComponentWithDetail
                      key={activity.id}
                      componentRoot={`${format(
                        new Date(activity.start_date_local),
                        'dd MMM'
                      )}  ${activity.name}  ${
                        Math.round(activity.distance * 1000) / 1000000
                      } kms`}
                      componentDetail={<StravaActivity {...activity} />}
                      link={`https://www.strava.com/activities/${activity.id}`}
                    />
                  );
                })}
            </div>

            <div
              style={{ minHeight: '25vh', maxHeight: '80vh', flex: '1 0 50%' }}
            >
              <ChartComponent
                type="bar"
                data={{
                  labels: getStatsFromActivities().map((data) =>
                    format(data.x, 'MMM yyyy')
                  ),
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
                      data: Object.keys(getActivitiesByMonth()).map(
                        (month) => getActivitiesByMonth()[month].length
                      ),
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
        (tokenExpirationDate &&
          isBefore(
            new Date((tokenExpirationDate as number) * 1000),
            new Date()
          ))) && (
        <a
          href={`https://www.strava.com/oauth/authorize?client_id=${process.env.REACT_APP_STRAVA_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_FRONTEND_URL}&response_type=code&scope=read,activity:read`}
        >
          <Button>Se connecter</Button>
        </a>
      )}
    </div>
  );

  return (
    <Widget
      id={props.id}
      tabId={props.tabId}
      config={{}}
      header={widgetHeader}
      body={widgetBody}
      refreshFunction={refreshWidget}
      onDeleteButtonClicked={props.onDeleteButtonClicked}
    />
  );
}
