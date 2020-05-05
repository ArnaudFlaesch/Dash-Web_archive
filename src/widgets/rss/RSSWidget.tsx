import * as React from 'react';
import * as RSSParser from 'rss-parser';
import * as winston from 'winston';
import ComponentWithDetail from '../../components/detailComponent/ComponentWithDetail';
import { IArticle, ImageContent, IRSSHeader } from "./IArticle";
import RSSArticle from './RSSArticle';
import "./RSSWidget.scss";

interface IProps {
	url: string;
}

interface IState {
	CORS_PROXY: string;
	url: string;
	title: string;
	description: string;
	image?: ImageContent;
	link: string;
	feed: IArticle[];
	parser: any;
}

export class RSSWidget extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.state = {
			CORS_PROXY: 'https://cors-anywhere.herokuapp.com/',
			description: "",
			feed: [],
			image: undefined,
			link: "",
			parser: new RSSParser(),
			title: "",
			url: props.url,
		}
		this.updateWidget = this.updateWidget.bind(this);
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
				winston.log('debug', error.message);
			});
	}

	public updateWidget() {
		this.setState({feed: []});
		this.fetchDataFromRssFeed();
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
						<button onClick={this.updateWidget} className="btn btn-default refreshButton"><i className="fa fa-refresh" aria-hidden="true" /></button>
					</div>
				</div>
				<div className="rssDescription">{this.state.description}</div>
				<div className="feed">
					{this.getFeedFromRSS(this.state.feed)}
				</div>
			</div>
		);
	}
}