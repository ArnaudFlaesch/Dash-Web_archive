import * as Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
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

  it('Should display the title in the header', () => {
    const article: IArticle = {
      guid: '1',
      content: 'Test contenu',
      pubDate: new Date().toLocaleString('fr'),
      title: 'Test titre article',
      link: 'https://google.com'
    };
    const component = Enzyme.shallow(<RSSArticle {...article} />);
    expect(component.find('a').text()).toEqual('Test titre article');
  });
});
