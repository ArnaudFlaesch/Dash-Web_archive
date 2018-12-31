import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {IArticle} from "../../components/widgets/rss/IArticle";
import  RSSArticle from '../../components/widgets/rss/RSSArticle';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const article : IArticle = {"guid" : "1", "link" : "http://google.com"}
  ReactDOM.render(<RSSArticle {...article} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
