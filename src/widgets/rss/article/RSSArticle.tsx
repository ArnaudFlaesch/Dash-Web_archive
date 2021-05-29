import { FunctionComponent } from 'react';
import { formatDateFromUTC } from '../../../utils/DateUtils';
import { IArticle } from './IArticle';
import './RSSArticle.scss';

function stripHtmlFromContent(content?: string) {
  const div = document.createElement('div');
  div.innerHTML = content || '';
  return div.textContent || div.innerText || '';
}

const RSSArticle: FunctionComponent<IArticle> = (props) => {
  return (
    <div className="article">
      <div className="articleTitle">
        <a href={props.link}>{props.title}</a>
      </div>
      <div className="articleContent">
        {stripHtmlFromContent(props.content) ||
          stripHtmlFromContent(props.description)}
      </div>
      <div className="articlePubDate">
        Publié le {formatDateFromUTC(props.pubDate || '')}{' '}
        {props.author && 'par ' + props.author}
      </div>
    </div>
  );
};

export default RSSArticle;
