import { FunctionComponent } from 'react';
import { adjustTimeWithOffset, formatDateFromTimestamp } from '../../../utils/DateUtils';
import { IForecast } from '../IWeather';
import './Forecast.scss';

const Forecast: FunctionComponent<IForecast> = (props) => {
  return (
    <div className="forecast">
      <div>
        {formatDateFromTimestamp(props.dt, adjustTimeWithOffset(props.city.timezone)).toLocaleString('fr', {
          weekday: 'short',
          day: 'numeric',
          hour: '2-digit'
        })}
      </div>
      <div className="flex flex-row">
        <div>
          <img
            src={`https://openweathermap.org/img/wn/${props.weather[0]?.icon}@2x.png`}
            className="smallImage"
            title={props.weather[0]?.description}
            alt={props.weather[0]?.description}
          />
        </div>
        <div>
          <div>
            <i className="fa fa-thermometer-three-quarters fa-sm mr-3" style={{ color: 'crimson' }} />
            {props.main.temp_max}°
          </div>
          <div>
            <i className="fa fa-thermometer-quarter fa-sm mr-3" style={{ color: 'blue' }} />
            {props.main.temp_min}°
          </div>
          <div>
            <i className="fa fa-tint fa-sm mr-3" style={{ color: 'lightblue' }} />
            {props.main.humidity}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecast;
