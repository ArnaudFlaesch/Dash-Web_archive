import axios from "axios";
import * as React from 'react';
import * as RSSParser from 'rss-parser';
import ComponentWithDetail from '../../components/detailComponent/ComponentWithDetail';
import { ModeEnum } from '../../enums/ModeEnum';
import logger from '../../utils/LogUtils';
import { IArticle, ImageContent, IRSSHeader } from "./article/IArticle";
import RSSArticle from './article/RSSArticle';
import EmptyRSSWidget from './emptyWidget/EmptyRSSWidget';
import "./RSSWidget.scss";

interface IProps {
	id: number;
	url?: string;
}

interface IState {
	id: number;
	CORS_PROXY: string;
	url?: string;
	title: string;
	description: string;
	image?: ImageContent;
	link: string;
	feed?: IArticle[];
	mode: ModeEnum;
	parser: RSSParser;
}

export class RSSWidget extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.state = {
			id: props.id,
			CORS_PROXY: `${process.env.REACT_APP_PROXY_URL}:${process.env.REACT_APP_CORS_PORT}/`,
			description: "",
			feed: undefined,
			image: undefined,
			link: "",
			mode: ModeEnum.READ,
			parser: new RSSParser(),
			title: "",
			url: props.url
		}
		this.refreshWidget = this.refreshWidget.bind(this);
		this.editWidget = this.editWidget.bind(this);
		this.onUrlSubmitted = this.onUrlSubmitted.bind(this);
	}

	public fetchDataFromRssFeed() {
		this.state.parser.parseURL(this.state.CORS_PROXY + this.state.url)
			.then((result: IRSSHeader) => {
				this.setState({
					description: result.description,
					feed: result.items,
					image: result.image,
					link: result.link,
					title: result.title,
				})
			})
			.catch((error: Error) => {
				logger.debug(error.message);
			});
	}

	public refreshWidget(): void {
		this.setState({ feed: [] });
		this.fetchDataFromRssFeed();
	}

	public editWidget(): void {
		this.setState({mode: ModeEnum.EDIT});
	}

	public onUrlSubmitted(rssUrl: string) {
		axios.post(`${process.env.REACT_APP_BACKEND_URL}/db/updateWidget`, { "id": this.state.id, "data": { "url": rssUrl } },
		{
			headers: {
			  'Content-type': 'application/json'
			}
		  })
			.then(response => {
				this.setState({ url: rssUrl }, () => {
					this.refreshWidget();
					this.setState({mode: ModeEnum.READ});
				});
			})
			.catch(error => {
				logger.error(error.message);
			})
	}

	public getFeedFromRSS(data: IArticle[]) {
		return (
			data.map((article) => {
				return (
					<ComponentWithDetail key={article.guid} componentRoot={article.title || article.link} componentDetail={<RSSArticle {...article} />} link={article.link} />
				)
			})
		)
	}

	public componentDidMount() {
		this.fetchDataFromRssFeed();
	}

	public render() {
		return (
			<div>
				{this.state.url && this.state.feed && this.state.mode === ModeEnum.READ
					?
					<div>
						<div className="header">
							<div className="leftGroup widgetHeader">
								<div className="rssWidgetTitle">
									<a href={this.state.link} className="flexRow">
										{this.state.image &&
											<div>
												<img className="imgLogoRSS" src={this.state.image.url} alt="logo" />
											</div>
										}
										<div className="rssTitle">
											{this.state.title}
										</div>
									</a>
								</div>
							</div>
							<div className="rightGroup">
								<button onClick={this.editWidget} className="btn btn-default editButton"><i className="fa fa-cog" aria-hidden="true" /></button>
								<button onClick={this.refreshWidget} className="btn btn-default refreshButton"><i className="fa fa-refresh" aria-hidden="true" /></button>
							</div>
						</div>
						<div className="rssDescription">{this.state.description}</div>
						<div className="feed">
							{this.getFeedFromRSS(this.state.feed)}
						</div>
					</div>
					: <EmptyRSSWidget url={this.state.url} onUrlSubmitted={this.onUrlSubmitted} />
				}
			</div>
		);
	}
}