import * as React from 'react';
import { formatDateFromUTC } from '../../../utils/DateUtils';
import { IArticle } from './IArticle';
import './RSSArticle.scss';

function stripHtmlFromContent(content?: string) {
  const div = document.createElement('div');
  div.innerHTML = content || '';
  return div.textContent || div.innerText || '';
}

const RSSArticle: React.FunctionComponent<IArticle> = (props) => {
  return (
    <div className="article">
      <div>
        <a href={props.link}>{props.title}</a>
      </div>
      <div>
        {stripHtmlFromContent(props.content) ||
          stripHtmlFromContent(props.description)}
      </div>
      <div>
        Publié le {formatDateFromUTC(props.pubDate || '')}{' '}
        {props.author && 'par ' + props.author}
      </div>
    </div>
  );
};

export default RSSArticle;
