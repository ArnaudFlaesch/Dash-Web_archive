import * as Enzyme from 'enzyme';
import { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Navbar from '../../navigation/navbar/Navbar';

Enzyme.configure({ adapter: new Adapter() });

describe('Navbar tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Navbar navItems={[]} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('should render 3 nav menu items', () => {
    const navItems = [
      {
        link: '/',
        icon: 'fa fa-home fa-lg'
      },
      {
        link: '/store',
        icon: 'fa fa-plus-circle fa-lg'
      },
      {
        link: '/profile',
        icon: 'fa fa-user fa-lg'
      }
    ];
    const component = shallow(<Navbar navItems={navItems} />);
    expect(component.find('.dashNavbarLink').length).toEqual(3);
  });
});
