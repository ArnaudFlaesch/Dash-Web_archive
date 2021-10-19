import { adjustTimeWithOffset, formatDateFromTimestamp } from '../../../utils/DateUtils';
import { IForecast } from '../IWeather';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import OpacityIcon from '@mui/icons-material/Opacity';
export default function Forecast(props: IForecast): React.ReactElement {
  return (
    <div className=" forecast border-2 border-solid border-black">
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
            className="max-h-14 max-w-14"
            title={props.weather[0]?.description}
            alt={props.weather[0]?.description}
          />
        </div>
        <div>
          <div>
            <DeviceThermostatIcon style={{ color: 'crimson' }} className="m-r-1" />
            {props.main.temp_max}°
          </div>
          <div>
            <DeviceThermostatIcon style={{ color: 'blue' }} className="m-r-1" />
            {props.main.temp_min}°
          </div>
          <div>
            <OpacityIcon style={{ color: 'lightblue' }} className="m-r-1" />
            {props.main.humidity}%
          </div>
        </div>
      </div>
    </div>
  );
}
