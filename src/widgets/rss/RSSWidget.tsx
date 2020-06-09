import * as React from 'react';
import { useEffect, useState } from 'react';
import * as RSSParser from 'rss-parser';
import ComponentWithDetail from '../../components/detailComponent/ComponentWithDetail';
import { ModeEnum } from '../../enums/ModeEnum';
import { updateWidget } from '../../services/WidgetService';
import logger from '../../utils/LogUtils';
import DeleteWidget from '../utils/DeleteWidget';
import { IArticle, ImageContent, IRSSHeader } from "./article/IArticle";
import RSSArticle from './article/RSSArticle';
import EmptyRSSWidget from './emptyWidget/EmptyRSSWidget';
import "./RSSWidget.scss";

interface IProps {
	id: number;
	url?: string;
	onDeleteButtonClicked: (idWidget: number) => void;
}

export default function RSSWidget(props: IProps) {
	const [mode, setMode] = useState(ModeEnum.READ);
	const parser = new RSSParser();
	const [feed, setFeed] = useState<IArticle[]>([]);
	const [url, setUrl] = useState(props.url);
	const [description, setDecription] = useState("");
	const [image, setImage] = useState<ImageContent>();
	const [link, setLink] = useState("");
	const [title, setTitle] = useState("");

	useEffect(() => {
		fetchDataFromRssFeed();
		setInterval(fetchDataFromRssFeed, 60000);
	}, [])

	const fetchDataFromRssFeed = () => {
		parser.parseURL(`${process.env.REACT_APP_BACKEND_URL}/proxy/?url=${url}`)
			.then((result: IRSSHeader) => {
				setDecription(result.description);
				setFeed(result.items);
				setImage(result.image);
				setLink(result.link);
				setTitle(result.title);
			})
			.catch((error: Error) => {
				logger.debug(error.message);
			});
	}

	const refreshWidget = () => {
		setFeed([]);
		fetchDataFromRssFeed();
	}

	const editWidget = () => {
		setMode(ModeEnum.EDIT);
	}

	const onUrlSubmitted = (rssUrl: string) => {
		updateWidget(props.id, { url: rssUrl })
			.then(response => {
				setUrl(rssUrl);
				refreshWidget();
				setMode(ModeEnum.READ);
			})
			.catch(error => {
				logger.error(error.message);
			})
	}

	const cancelDeletion = () => {
		setMode(ModeEnum.READ);
	}

	const deleteWidget = () => {
		setMode(ModeEnum.DELETE);
	}

	const getFeedFromRSS = (data: IArticle[]) => {
		return (
			data.map((article) => {
				return (
					<ComponentWithDetail key={article.guid} componentRoot={article.title || article.link} componentDetail={<RSSArticle {...article} />} link={article.link} />
				)
			})
		)
	}

	return (
		<div>
			{url && feed && mode === ModeEnum.READ
				?
				<div>
					<div className="header">
						<div className="leftGroup widgetHeader">
							<div className="rssWidgetTitle">
								<a href={link} className="flexRow">
									{image &&
										<div>
											<img className="imgLogoRSS" src={image?.url} alt="logo" />
										</div>
									}
									<div className="rssTitle">
										{title}
									</div>
								</a>
							</div>
						</div>
						<div className="rightGroup">
							<button onClick={editWidget} className="btn btn-default editButton"><i className="fa fa-cog" aria-hidden="true" /></button>
							<button onClick={refreshWidget} className="btn btn-default refreshButton"><i className="fa fa-refresh" aria-hidden="true" /></button>
							<button onClick={deleteWidget} className="btn btn-default deleteButton"><i className="fa fa-trash" aria-hidden="true" /></button>
						</div>
					</div>
					<div className="rssDescription">{description}</div>
					<div className="feed">
						{getFeedFromRSS(feed)}
					</div>
				</div>
				: (mode === ModeEnum.DELETE)
					? <DeleteWidget idWidget={props.id} onDeleteButtonClicked={props.onDeleteButtonClicked} onCancelButtonClicked={cancelDeletion} />
					: <EmptyRSSWidget url={url} onUrlSubmitted={onUrlSubmitted} />
			}
		</div>
	);
}