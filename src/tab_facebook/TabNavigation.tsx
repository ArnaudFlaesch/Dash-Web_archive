import { FunctionComponent } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import ITab from './ITab';
import './TabNavigation.scss';

interface IProps {
  tabList: ITab[];
}

const TabNavigation: FunctionComponent<IProps> = (props) => {
  return (
    <div>
      <Router>
        <div>
          <div className="tabContainer">
            {props.tabList.map((tab: ITab) => {
              return (
                <div key={tab.title}>
                  <Link to={tab.path}>{tab.title}</Link>
                </div>
              );
            })}
          </div>
          <div>
            {props.tabList.map((tab: ITab) => {
              return (
                <div key={tab.title}>
                  <Route path={tab.path} exact={tab.exact} component={tab.component} />
                </div>
              );
            })}
          </div>
        </div>
      </Router>
    </div>
  );
};

export default TabNavigation;
