import CheckIcon from '@mui/icons-material/Check';
import MinimizeIcon from '@mui/icons-material/Minimize';
import { IconButton } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import RSSParser from 'rss-parser';
import IBaseWidgetConfig from 'src/model/IBaseWidgetConfig';
import authorizationBearer from 'src/services/auth.header';
import ComponentWithDetail from '../../components/detailComponent/ComponentWithDetail';
import { updateWidgetData } from '../../services/widget.service';
import logger from '../../utils/LogUtils';
import Widget from '../Widget';
import { IArticle, ImageContent, IRSSHeader } from './article/IArticle';
import RSSArticle from './article/RSSArticle';
import EmptyRSSWidget from './emptyWidget/EmptyRSSWidget';
import './RSSWidget.scss';

interface IProps extends IBaseWidgetConfig {
  url?: string;
  readArticlesGuids?: string[];
}

export default function RSSWidget(props: IProps): React.ReactElement {
  const [feed, setFeed] = useState<IArticle[]>([]);
  const [url, setUrl] = useState(props.url || '');
  const [description, setDecription] = useState('');
  const [image, setImage] = useState<ImageContent>();
  const [link, setLink] = useState('');
  const [title, setTitle] = useState('');
  const [isFeedClosed, setFeedClosed] = useState(true);
  const [readArticles, setReadArticles] = useState<string[]>(props.readArticlesGuids || []);
  const rssParser = new RSSParser();

  function fetchDataFromRssFeed() {
    if (url) {
      axios
        .get<string>(`${process.env.REACT_APP_BACKEND_URL}/proxy/?url=${url}`, {
          headers: {
            Authorization: authorizationBearer(),
            'Content-type': 'application/json'
          }
        })
        .then((apiResult) => {
          rssParser
            .parseString(apiResult.data)
            .then((response) => {
              const result = response as IRSSHeader;
              setDecription(result.description);
              setFeed(result.items);
              setImage(result.image);
              setLink(result.link);
              setTitle(result.title);
            })
            .catch((error) => {
              logger.error(error.message);
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

  function onUrlSubmitted(rssUrl: string): void {
    updateWidgetData(props.id, { url: rssUrl, guidsList: [] })
      .then(() => {
        setUrl(rssUrl);
        refreshWidget();
      })
      .catch((error) => {
        logger.error(error.message);
      });
  }

  function formatTitleForArticle(article: IArticle) {
    const date = article.pubDate
      ? new Date(article.pubDate).toLocaleTimeString('fr', {
          hour: '2-digit',
          minute: '2-digit'
        })
      : '';
    return (
      <div className={`rssArticle ${readArticles.includes(article.guid) ? 'read' : ''}`}>
        {date} {article.title}
      </div>
    );
  }

  function onOpenDetail(guid: string): void {
    setFeedClosed(false);
    if (!readArticles.includes(guid)) {
      updateRssFeed([guid, ...readArticles]);
    }
  }

  function markAllFeedAsRead(): void {
    updateRssFeed(feed.map((article) => article.guid));
  }

  function updateRssFeed(readArticlesGuids: string[]): void {
    updateWidgetData(props.id, {
      url: url,
      readArticlesGuids: readArticlesGuids
    })
      .then((result) => {
        setReadArticles(result.data.data.readArticlesGuids as []);
      })
      .catch((error) => {
        logger.error(error.message);
      });
  }

  function closeFeeds(): void {
    setFeedClosed(true);
  }

  function getFeedFromRSS(data: IArticle[]) {
    return data.map((article) => {
      return (
        <ComponentWithDetail
          key={article.guid}
          componentRoot={formatTitleForArticle(article)}
          componentDetail={<RSSArticle {...article} />}
          link={article.link}
          isClosed={isFeedClosed}
          onOpenDetail={() => onOpenDetail(article.guid)}
        />
      );
    });
  }

  const widgetHeader = (
    <div className="rssWidgetTitle">
      <a href={link} className="flex flex-row">
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
    <div className="flex flex-row">
      <IconButton className="markAllArticlesAsRead" color="primary" onClick={markAllFeedAsRead}>
        <CheckIcon />
      </IconButton>

      <IconButton className="minimizeAllArticles" color="primary" onClick={closeFeeds}>
        <MinimizeIcon />
      </IconButton>
    </div>
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
    <Widget
      id={props.id}
      tabId={props.tabId}
      config={{ url: url }}
      header={widgetHeader}
      additionalActionButtons={additionalActionButtons}
      body={widgetBody}
      editModeComponent={<EmptyRSSWidget url={url} onUrlSubmitted={onUrlSubmitted} />}
      refreshFunction={refreshWidget}
      onDeleteButtonClicked={props.onDeleteButtonClicked}
    />
  );
}
