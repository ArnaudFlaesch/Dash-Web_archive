import axios from 'axios';
import { useEffect, useState } from 'react';
import RSSParser from 'rss-parser';
import authorizationBearer from 'src/services/auth.header';
import ComponentWithDetail from '../../components/detailComponent/ComponentWithDetail';
import { updateWidgetData } from '../../services/widget.service';
import logger from '../../utils/LogUtils';
import Widget from '../Widget';
import { IArticle, ImageContent, IRSSHeader } from './article/IArticle';
import RSSArticle from './article/RSSArticle';
import EmptyRSSWidget from './emptyWidget/EmptyRSSWidget';
import './RSSWidget.scss';

interface IProps {
  id: number;
  url?: string;
  tabId: number;
  onDeleteButtonClicked: (idWidget: number) => void;
}

export default function RSSWidget(props: IProps): React.ReactElement {
  const [feed, setFeed] = useState<IArticle[]>([]);
  const [url, setUrl] = useState(props.url);
  const [description, setDecription] = useState('');
  const [image, setImage] = useState<ImageContent>();
  const [link, setLink] = useState('');
  const [title, setTitle] = useState('');
  const [isFeedClosed, setFeedClosed] = useState(true);
  const rssParser = new RSSParser();

  function fetchDataFromRssFeed() {
    if (url) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/proxy/?url=${url}`, {
          headers: {
            Authorization: authorizationBearer(),
            'Content-type': 'application/json'
          }
        })
        .then((apiResult) => {
          rssParser.parseString(apiResult.data as string).then((response) => {
            const result = response as IRSSHeader;
            setDecription(result.description);
            setFeed(result.items);
            setImage(result.image);
            setLink(result.link);
            setTitle(result.title);
          });
        })
        .catch((error) => {
          logger.error(error.message);
        });
    }
  }

  useEffect(() => {
    fetchDataFromRssFeed();
  }, [url]);

  function refreshWidget() {
    setFeed([]);
    fetchDataFromRssFeed();
  }

  function onUrlSubmitted(rssUrl: string) {
    updateWidgetData(props.id, { url: rssUrl })
      .then(() => {
        setUrl(rssUrl);
        refreshWidget();
      })
      .catch((error) => {
        logger.error(error.message);
      });
  }

  function formatTitleForArticle(pubDate: string, articleTitle?: string) {
    const date = pubDate
      ? new Date(pubDate).toLocaleTimeString('fr', {
          hour: '2-digit',
          minute: '2-digit'
        })
      : '';
    return (
      <div className="rssArticle">
        {date} {articleTitle}
      </div>
    );
  }

  function onOpenDetail() {
    setFeedClosed(false);
  }

  function closeFeeds(): void {
    setFeedClosed(true);
  }

  function getFeedFromRSS(data: IArticle[]) {
    return data.map((article) => {
      return (
        <ComponentWithDetail
          key={article.guid}
          componentRoot={formatTitleForArticle(article.pubDate, article.title)}
          componentDetail={<RSSArticle {...article} />}
          link={article.link}
          isClosed={isFeedClosed}
          onOpenDetail={onOpenDetail}
        />
      );
    });
  }

  const widgetHeader = (
    <div className="rssWidgetTitle">
      <a href={link} className="flexRow">
        {image && (
          <div>
            <img className="imgLogoRSS" src={image?.url} alt="logo" />
          </div>
        )}
        <div className="rssTitle">{title}</div>
      </a>
    </div>
  );

  const additionalActionButtons = (
    <button onClick={closeFeeds} className="btn btn-default">
      <i className="fa fa-window-minimize" aria-hidden="true" />
    </button>
  );

  const widgetBody = (
    <div>
      {url && feed && (
        <div>
          <div className="rssDescription">{description}</div>
          <div className="feed">{getFeedFromRSS(feed)}</div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <Widget
        id={props.id}
        tabId={props.tabId}
        config={{ url: url }}
        header={widgetHeader}
        additionalActionButtons={additionalActionButtons}
        body={widgetBody}
        editModeComponent={
          <EmptyRSSWidget url={url} onUrlSubmitted={onUrlSubmitted} />
        }
        refreshFunction={refreshWidget}
        onDeleteButtonClicked={props.onDeleteButtonClicked}
      />
    </div>
  );
}
