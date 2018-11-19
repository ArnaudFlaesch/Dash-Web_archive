import React, { Component } from 'react';
import RSSParser from 'rss-parser';
import { RSSArticle } from './RSSArticle';

export class RSSWidget extends Component {

	constructor(props) {
		super(props);
		this.CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
		this.url = props.url;
		this.title = "";
		this.description = "";
		this.link = "";
		this.feed = [];
		this.parser = new RSSParser();
	}

	fetchDataFromRssFeed() {
		this.parser.parseURL(this.CORS_PROXY + this.url)
			.then(result => {
				this.title = result.title;
				this.description = result.description;
				this.image = result.image;
				this.link = result.link;
				this.feed = result.items;
				this.setState(this.feed);
			})
			.catch(error => {
				console.log(error);
			});
	}

	getFeedFromRSS(data) {
		return (
			<div>
				{
					data.map(article => {
						return (<RSSArticle key={article.guid || article.link} article={article} />)
					})
				}
			</div>
		)
	}

	componentDidMount() {
		this.fetchDataFromRssFeed();
	}

	render() {
		return (
			<div key={this.title} className="widget">
				<div className="widgetHeader">
					<a href={this.link}>
						{this.image &&
							<img className="imgLogoRSS" src={this.image.url} alt="logo" />
						}
						{this.title}
					</a>
				</div>
				<div>{this.description}</div>
				<div className="feed">
					{this.getFeedFromRSS(this.feed)}
				</div>
			</div>
		);
	}
}