import * as React from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';
import { IMenu } from '../../Dash';
import './Navbar.scss';

interface IProps {
    navItems: IMenu[]
}

const Navbar: React.FunctionComponent<IProps> = props => {
    return (
        <div className='dashNavbar'>
            <Nav vertical={true} navbar={true}>
                {props.navItems.map(menu => {
                    return (
                        <NavItem key={menu.link} className="dashNavbarLink">
                            <Link to={menu.link}><i className={menu.icon} aria-hidden="true" /></Link>
                        </NavItem>
                    )
                })
                }
            </Nav>
        </div>
    )
}

export default Navbar;