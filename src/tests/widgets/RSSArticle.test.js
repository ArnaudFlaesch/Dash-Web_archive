import React from 'react';
import ReactDOM from 'react-dom';
import { RSSArticle } from '../../components/widgets/RSSArticle';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const article = {"guid" : 1, "link" : "http://google.com"}
  ReactDOM.render(<RSSArticle article={article} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
