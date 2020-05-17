import axios from "axios";
import * as React from 'react';
import { ModeEnum } from '../../enums/ModeEnum';
import { adjustTimeWithOffset, formatDateFromTimestamp } from '../../utils/DateUtils';
import logger from '../../utils/LogUtils';
import { ICity, IForecast, IWeather } from "./IWeather";
import './WeatherWidget.scss';

export interface IProps {
	id: number;
	weather_api_key?: string;
	city?: string;
}

interface IState {
	id: number;
	mode: ModeEnum;
	API_KEY?: string;
	CORS_PROXY: string;
	city?: string;
	location?: ICity;
	weather?: IWeather,
	forecast?: IForecast[];
	WEATHER_API: string;
	WEATHER_ENDPOINT: string;
	FORECAST_ENDPOINT: string;
	API_OPTIONS: string;
}

export class WeatherWidget extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.state = {
			id: this.props.id,
			mode: ModeEnum.READ,
			API_KEY: props.weather_api_key,
			city: props.city,
			CORS_PROXY: `${process.env.REACT_APP_PROXY_URL}:${process.env.REACT_APP_CORS_PORT}/`,
			WEATHER_API: "http://api.openweathermap.org/data/2.5/",
			WEATHER_ENDPOINT: "weather",
			FORECAST_ENDPOINT: "forecast",
			API_OPTIONS: "?units=metric&lang=fr&appid=",
			weather: undefined,
			forecast: undefined,
			location: undefined
		}
		this.editWidget = this.editWidget.bind(this);
		this.updateWidget = this.updateWidget.bind(this)
	}

	public componentDidMount() {
		this.fetchDataFromWeatherApi();
	}

	public fetchDataFromWeatherApi() {
		axios.get(
			this.state.CORS_PROXY
			+ this.state.WEATHER_API
			+ this.state.WEATHER_ENDPOINT
			+ this.state.API_OPTIONS
			+ this.state.API_KEY
			+ "&q=" + this.state.city
		)
			.then(result => {
				this.setState({
					weather: result.data
				});
			})
			.catch((error: Error) => {
				logger.debug(error);
			});
		axios.get(this.state.CORS_PROXY
			+ this.state.WEATHER_API
			+ this.state.FORECAST_ENDPOINT
			+ this.state.API_OPTIONS
			+ this.state.API_KEY
			+ "&q=" + this.state.city
		)
			.then(result => {
				this.setState({
					forecast: result.data.list,
					location: result.data.city
				});
			})
			.catch((error: Error) => {
				logger.debug(error.message);
			});
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

	public updateWidget() {
		this.setState({
			weather: undefined,
			forecast: undefined,
			location: undefined
		});
		this.fetchDataFromWeatherApi();
	}

	public render() {
		return (
			<div>
				<div className="header">
					<div className="leftGroup widgetHeader">
						La météo aujourd'hui à {this.props.city}
					</div>
					<div className="rightGroup">
						<button onClick={this.editWidget} className="btn btn-default editButton"><i className="fa fa-cog" aria-hidden="true" /></button>
						<button onClick={this.updateWidget} className="btn btn-default refreshButton"><i className="fa fa-refresh" aria-hidden="true" /></button>
						<button onClick={this.deleteWidget} className="btn btn-default deleteButton"><i className="fa fa-trash" aria-hidden="true" /></button>
					</div>
				</div>
				{this.state.location && this.state.weather &&
					<div>
						<div className="flexRow">
							<div><img src={`https://openweathermap.org/img/wn/${this.state.weather.weather[0].icon}@2x.png`} title={this.state.weather.weather[0].description} alt={this.state.weather.weather[0].description} /></div>
							<div>
								<div>{this.state.weather.weather[0].description}</div>
								<div>Température : {this.state.weather.main.temp}°</div>
								<div>
									<div>Lever du soleil : {formatDateFromTimestamp(this.state.weather.sys.sunrise, adjustTimeWithOffset(this.state.weather.timezone))}</div>
									<div>Coucher du soleil : {formatDateFromTimestamp(this.state.weather.sys.sunset, adjustTimeWithOffset(this.state.weather.timezone))}</div>
								</div>
								<div>Dernière mise à jour le : {formatDateFromTimestamp(this.state.weather.dt, adjustTimeWithOffset(this.state.weather.timezone))}</div>
							</div>
						</div>
					</div>
				}
				<br />

				<div>
					<span className="bold">Prévisions</span>
					<br />
					<div className="flexRow">
						{this.state.location && this.state.forecast && this.state.forecast.map(forecastDay => {
							return (
								<div key={forecastDay.dt} className='forecast'>
									<div>{formatDateFromTimestamp(forecastDay.dt, adjustTimeWithOffset(this.state.location!!.timezone))}</div>
									<div>
										<img src={`https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png`} className="smallImage" title={forecastDay.weather[0].description} alt={forecastDay.weather[0].description} />
									</div>
									<div>
										<div>Min : {forecastDay.main.temp_min}°</div>
										<div>Max : {forecastDay.main.temp_max}°</div>
										<div>Humidité : {forecastDay.main.humidity}%</div>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		)
	}
}