import React, { Component } from "react";
import { formatDateFromUTC } from "../../utils/DateUtils";

export class RSSArticle extends Component {

	constructor(props) {
		super(props);
		this.guid = props.article.guid;
		this.title = props.article.title;
		this.link = props.article.link;
		this.content = props.article.content;
		this.author = props.article.author;
		this.pubDate = props.article.pubDate;
	}

	render() {
		return (
			<div className="article">
				<div><a href={this.link}>{this.title}</a></div>
				<div>{this.content}</div>
				<div>Publié le {formatDateFromUTC(this.pubDate)} {this.author && "par " + this.author}</div>
			</div>
		);
	}

}