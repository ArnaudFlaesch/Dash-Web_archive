import * as Enzyme from 'enzyme';
import { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IArticle } from '../../../widgets/rss/article/IArticle';
import RSSArticle from '../../../widgets/rss/article/RSSArticle';

Enzyme.configure({ adapter: new Adapter() });

describe('RSS Article component tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    const article: IArticle = {
      guid: '1',
      link: 'https://google.com',
      pubDate: new Date().toLocaleString('fr'),
      content: ''
    };
    ReactDOM.render(<RSSArticle {...article} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('CheckboxWithLabel changes the text after click', () => {
    const article: IArticle = {
      guid: '1',
      content: 'Test contenu',
      pubDate: new Date().toLocaleString('fr'),
      title: 'Test titre article',
      link: 'https://google.com'
    };
    const component = shallow(<RSSArticle {...article} />);
    expect(component.find('a').text()).toEqual('Test titre article');
  });
});
