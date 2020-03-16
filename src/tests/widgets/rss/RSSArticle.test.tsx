import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import { IArticle } from "../../../widgets/rss/IArticle";
import RSSArticle from '../../../widgets/rss/RSSArticle';
import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('RSS Article component tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    const article: IArticle = { "guid": "1", "link": "http://google.com" }
    ReactDOM.render(<RSSArticle {...article} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('CheckboxWithLabel changes the text after click', () => {
    const article: IArticle = {
      guid: "1",
      content: "Test contenu",
      title: "Test titre article",
      link: "http://google.com",
    }
    const component = shallow(
      <RSSArticle {...article} />,
    );
    //expect(component.text()).toEqual('Off');

    //component.find('input').simulate('change');

    expect(component.find('a').text()).toEqual('Test titre article');
  });
});

