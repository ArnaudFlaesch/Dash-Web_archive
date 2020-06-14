import Navbar  from "../../navbar/Navbar";
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { shallow } from 'enzyme';

describe("Navbar tests", () => {
    it('renders without crashing', () => {
      const div = document.createElement('div');
      ReactDOM.render(<Navbar navItems={[]} />, div);
      ReactDOM.unmountComponentAtNode(div);
    });

    it('should render 3 nav menu items', () => {
        const navItems = [{
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
        }];
        const component = shallow(
            <Navbar navItems={navItems} />,
          );
        expect(component.find('dashNavbar').length).toEqual(3);
      });
  });
  