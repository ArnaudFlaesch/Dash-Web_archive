import axios from "axios";
import * as React from 'react';
import { ModeEnum } from '../../enums/ModeEnum';
import { updateWidget } from '../../services/WidgetService';
import { adjustTimeWithOffset, formatDateFromTimestamp } from '../../utils/DateUtils';
import logger from '../../utils/LogUtils';
import DeleteWidget from '../utils/DeleteWidget';
import EmptyWeatherWidget from './emptyWidget/EmptyWeatherWidget';
import Forecast from './forecast/Forecast';
import { ICity, IForecast, IWeather } from "./IWeather";
import './WeatherWidget.scss';

export interface IProps {
	id: number;
	weather_api_key?: string;
	city?: string;
	onDeleteButtonClicked: (idWidget: number) => void;
}

interface IState {
	id: number;
	mode: ModeEnum;
	API_KEY?: string;
	cityToQuery?: string;
	city?: ICity;
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
			cityToQuery: props.city,
			WEATHER_API: "http://api.openweathermap.org/data/2.5/",
			WEATHER_ENDPOINT: "weather",
			FORECAST_ENDPOINT: "forecast",
			API_OPTIONS: "?units=metric&lang=fr&appid=",
			weather: undefined,
			forecast: undefined,
			city: undefined
		}

		this.refreshWidget = this.refreshWidget.bind(this);
		this.editWidget = this.editWidget.bind(this);
		this.onConfigSubmitted = this.onConfigSubmitted.bind(this);
		this.updateWidget = this.updateWidget.bind(this)
		this.cancelDeletion = this.cancelDeletion.bind(this);
		this.fetchDataFromWeatherApi = this.fetchDataFromWeatherApi.bind(this);
		this.deleteWidget = this.deleteWidget.bind(this);
	}

	public componentDidMount() {
		this.fetchDataFromWeatherApi();
		setInterval(this.fetchDataFromWeatherApi, 60000);
	}

	public fetchDataFromWeatherApi() {
		axios.get(`${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/proxy`, {
			params: {
				url: `${this.state.WEATHER_API}${this.state.WEATHER_ENDPOINT}${this.state.API_OPTIONS}${this.state.API_KEY}&q=${this.state.cityToQuery}`
			}
		})
			.then(result => {
				this.setState({
					weather: result.data
				});
			})
			.catch((error: Error) => {
				logger.debug(error);
			});
		axios.get(`${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/proxy`, {
			params: {
				url: `${this.state.WEATHER_API}${this.state.FORECAST_ENDPOINT}${this.state.API_OPTIONS}${this.state.API_KEY}&q=${this.state.cityToQuery}`
			}
		})
			.then((result: any) => {
				this.setState({
					forecast: result.data.list,
					city: result.data.city
				});
			})
			.catch((error: Error) => {
				logger.debug(error.message);
			});
	}

	public refreshWidget(): void {
		this.setState({
			weather: undefined,
			forecast: undefined,
			city: undefined
		});
		this.fetchDataFromWeatherApi();
	}

	public onConfigSubmitted(weatherApiKey: string, city: string) {
		updateWidget(this.state.id, { city, weather_api_key: weatherApiKey })
			.then(response => {
				this.setState({
					cityToQuery: city,
					API_KEY: weatherApiKey
				}, () => {
					this.refreshWidget();
					this.setState({ mode: ModeEnum.READ });
				});
			})
			.catch(error => {
				logger.error(error.message);
			})
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
			city: undefined
		});
		this.fetchDataFromWeatherApi();
	}

	public render() {
		return (
			<div>
				{this.state.mode === ModeEnum.READ
					?
					<div>
						<div className="header">
							<div className="leftGroup widgetHeader">
								La météo aujourd'hui à {this.state.city?.name}
							</div>
							<div className="rightGroup">
								<button onClick={this.editWidget} className="btn btn-default editButton"><i className="fa fa-cog" aria-hidden="true" /></button>
								<button onClick={this.updateWidget} className="btn btn-default refreshButton"><i className="fa fa-refresh" aria-hidden="true" /></button>
								<button onClick={this.deleteWidget} className="btn btn-default deleteButton"><i className="fa fa-trash" aria-hidden="true" /></button>
							</div>
						</div>
						{this.state.city && this.state.weather &&
							<div>
								<div className="flexRow">
									<div><img src={`https://openweathermap.org/img/wn/${this.state.weather.weather[0].icon}@2x.png`} title={this.state.weather.weather[0].description} alt={this.state.weather.weather[0].description} /></div>
									<div>
										<div>{this.state.weather.weather[0].description}</div>
										<div><i className="fa fa-thermometer-three-quarters fa-md" /> {this.state.weather.main.temp}°</div>
										<div className="space-between">
											<div><i className="fa fa-sun-o fa-md" /> {formatDateFromTimestamp(this.state.weather.sys.sunrise, adjustTimeWithOffset(this.state.weather.timezone)).toLocaleTimeString('fr')}</div>
											<div><i className="fa fa-moon-o fa-md" /> {formatDateFromTimestamp(this.state.weather.sys.sunset, adjustTimeWithOffset(this.state.weather.timezone)).toLocaleTimeString('fr')}</div>
										</div>
										<div><i className="fa fa-clock-o fa-md" /> {formatDateFromTimestamp(this.state.weather.dt, adjustTimeWithOffset(this.state.weather.timezone)).toLocaleString('fr')}</div>
									</div>
								</div>
							</div>
						}
						{this.state.city && this.state.forecast &&
							<div>
								<span className="bold">Prévisions</span>
								<br />
								<div className="flexRow forecastRow">
									{this.state.city && this.state.forecast && this.state.forecast.map(forecastDay => {
										return (
											<div className='forecastContainer' key={forecastDay.dt_text}>
												<Forecast  {...forecastDay} city={this.state.city!!} />
											</div>
										)
									})}
								</div>
							</div>
						}
					</div>
					: (this.state.mode === ModeEnum.DELETE)
						? <DeleteWidget idWidget={this.props.id} onDeleteButtonClicked={this.props.onDeleteButtonClicked} onCancelButtonClicked={this.cancelDeletion} />
						: <EmptyWeatherWidget city={this.state.cityToQuery} weather_api_key={this.state.API_KEY} onConfigSubmitted={this.onConfigSubmitted} />
				}
			</div>
		)
	}
}