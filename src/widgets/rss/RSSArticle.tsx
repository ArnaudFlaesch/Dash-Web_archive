import * as React from 'react';
import { formatDateFromUTC } from "../../utils/DateUtils";
import { IArticle } from "./IArticle";
import "./RSSArticle.scss";

const RSSArticle: React.FunctionComponent<IArticle> = props => {
	return (
		<div className="article">
			<div><a href={props.link}>{props.title}</a></div>
			<div>{props.content}</div>
			<div>Publié le {formatDateFromUTC(props.pubDate || "")} {props.author && "par " + props.author}</div>
		</div>
	);
}

export default RSSArticle;