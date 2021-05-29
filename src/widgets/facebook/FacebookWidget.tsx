import { Component } from 'react';
import ITab from '../../tab_facebook/ITab';
import TabNavigation from '../../tab_facebook/TabNavigation';
import logger from '../../utils/LogUtils';
import EventsTab from './events/EventsTab';
import { getProfileInfo } from './FacebookAPI';
import GroupsTab from './groups/GroupsTab';
import IFBUser from './IFBUser';

declare const window: any;
declare const FB: any;

interface IProps {
  appId?: string;
}

interface IState {
  loginStatusResponse: any;
  userData?: IFBUser;
}

const tabs: ITab[] = [
  {
    title: 'Groupes',
    component: GroupsTab,
    path: '/groups/'
  },
  {
    title: 'Events',
    component: EventsTab,
    path: '/events/'
  }
];

export default class FacebookWidget extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    window.fbAsyncInit = () => {
      FB.init({
        appId: props.appId,
        xfbml: true,
        version: 'v3.2'
      });

      // Broadcast an event when FB object is ready
      const fbInitEvent = new Event('FBObjectReady');
      document.dispatchEvent(fbInitEvent);
    };
    ((d, s, id) => {
      let js: any = d.getElementsByTagName(s)[0];
      const fjs: Element = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      if (fjs && fjs.parentNode) {
        fjs.parentNode.insertBefore(js, fjs);
      }
    })(document, 'script', 'facebook-jssdk');
    document.addEventListener('FBObjectReady', this.checkLoginStatus);
  }

  public componentWillUnmount(): void {
    document.removeEventListener('FBObjectReady', this.checkLoginStatus);
  }

  public checkLoginStatus = (): void => {
    FB.getLoginStatus(this.facebookLoginHandler);
  };

  /**
   * Check login status and call login api is user is not logged in
   */
  public facebookLogin = (): void => {
    logger.debug('facebookLogin');
    FB.getLoginStatus((response: any) => {
      logger.debug(response);
      this.setState({ loginStatusResponse: response });
      if (response.status !== 'connected') {
        FB.login(this.facebookLoginHandler, {
          scope:
            'user_birthday,user_hometown,user_likes,user_photos,user_friends,user_status,user_tagged_places,user_posts,user_gender,user_link,email,public_profile'
        });
      }
    });
  };

  public facebookLogout = (): void => {
    FB.logout((response: any) => {
      logger.debug(response);
      this.setState({ userData: undefined, loginStatusResponse: response });
    });
  };

  public facebookLoginHandler = (response: any): void => {
    logger.debug('facebookLoginHandler');
    this.setState({ loginStatusResponse: response });
    if (response.status === 'connected') {
      logger.debug('Connected');
      getProfileInfo()
        .then((result: IFBUser) => {
          logger.debug('Result');
          logger.debug(result);
          this.setState({ userData: result });
        })
        .catch((error: Error) => {
          logger.debug(error);
        });
    }
  };

  public render(): React.ReactElement {
    let element = null;
    if (
      this.state &&
      this.state.loginStatusResponse &&
      this.state.loginStatusResponse.status === 'connected' &&
      this.state.userData
    ) {
      const userData: IFBUser = this.state.userData;
      element = (
        <div>
          <div>
            {userData.first_name} {userData.last_name}
          </div>
          <div onClick={this.facebookLogout}>Se déconnecter</div>
        </div>
      );
    } else {
      element = (
        <div
          onClick={this.facebookLogin}
          className="fb-login-button"
          data-max-rows="1"
          data-size="large"
          data-button-type="continue_with"
          data-use-continue-as="true"
        />
      );
    }
    return (
      <div>
        {element}
        {this.state && this.state.userData && (
          <div>
            <TabNavigation tabList={tabs} />
          </div>
        )}
      </div>
    );
  }
}
