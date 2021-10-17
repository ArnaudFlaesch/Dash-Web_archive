import { FunctionComponent } from 'react';
import { formatDateFromUTC } from '../../../utils/DateUtils';
import { IArticle } from './IArticle';

function stripHtmlFromContent(content?: string) {
  const div = document.createElement('div');
  div.innerHTML = content || '';
  return div.textContent || div.innerText || '';
}

const RSSArticle: FunctionComponent<IArticle> = (props) => {
  return (
    <div className="border-2 border-gray-500 border-solid">
      <div className="articleTitle">
        <a href={props.link}>{props.title}</a>
      </div>
      <div className="articleContent">
        {stripHtmlFromContent(props.content) || stripHtmlFromContent(props.description)}
      </div>
      <div className="articlePubDate">
        Publié le {formatDateFromUTC(props.pubDate || '')} {props.author && 'par ' + props.author}
      </div>
    </div>
  );
};

export default RSSArticle;
