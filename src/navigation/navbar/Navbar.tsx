import * as React from 'react';
import { Nav, NavItem } from 'reactstrap';
import { IMenu } from '../../Dash';
interface IProps {
  navItems: IMenu[];
}

const Navbar: React.FunctionComponent<IProps> = (props) => {
  return (
    <div className="dashNavbar">
      <Nav vertical={true} navbar={true}>
        {props.navItems.map((menu) => {
          return (
            <NavItem key={menu.link} className="dashNavbarLink">
              <a href="#">
                <i className={menu.icon} aria-hidden="true" />
              </a>
            </NavItem>
          );
        })}
      </Nav>
    </div>
  );
};

export default Navbar;
