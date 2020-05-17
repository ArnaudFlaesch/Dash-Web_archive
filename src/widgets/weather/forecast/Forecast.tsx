import * as React from 'react';
import { adjustTimeWithOffset, formatDateFromTimestamp } from '../../../utils/DateUtils';
import { IForecast } from '../IWeather';
import './Forecast.scss';

const Forecast: React.FunctionComponent<IForecast> = props => {
    return (
        <div className='forecast'>
            <div>{formatDateFromTimestamp(props.dt, adjustTimeWithOffset(props.city.timezone))}</div>
            <div>
                <img src={`https://openweathermap.org/img/wn/${props.weather[0].icon}@2x.png`} className="smallImage" title={props.weather[0].description} alt={props.weather[0].description} />
            </div>
            <div>
                <div>Min : {props.main.temp_min}°</div>
                <div>Max : {props.main.temp_max}°</div>
                <div>Humidité : {props.main.humidity}%</div>
            </div>
        </div>
    )
}

export default Forecast;