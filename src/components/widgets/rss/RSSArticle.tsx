import * as React from 'react';
import { formatDateFromUTC } from "../../../utils/DateUtils";
import { IArticle } from "./IArticle";

interface IProps {
	article: IArticle;
}

interface IState {
	guid?: string;
	title?: string;
	link?: string;
	content?: string;
	author?: string;
	pubDate?: string;
}

export class RSSArticle extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.state = {
			author: props.article.author,
			content: props.article.content,
			guid: props.article.guid,
			link: props.article.link,
			pubDate: props.article.pubDate,
			title: props.article.title,
		};

	}

	public render() {
		return (
			<div className="article">
				<div><a href={this.state.link}>{this.state.title}</a></div>
				<div>{this.state.content}</div>
				<div>Publié le {formatDateFromUTC(this.state.pubDate || "")} {this.state.author && "par " + this.state.author}</div>
			</div>
		);
	}

}