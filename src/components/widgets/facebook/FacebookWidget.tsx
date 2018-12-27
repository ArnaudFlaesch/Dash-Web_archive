import * as React from 'react';
import logger from "../../../utils/LogUtils";

declare var window: any;
declare var FB: any;

interface IProps {
    appId?: string;
}

interface IState {
    username: string
}

export default class FacebookWidget extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        window.fbAsyncInit = () => {
            FB.init({
                appId: props.appId,
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v3.2'
            });

            // Broadcast an event when FB object is ready
            const fbInitEvent = new Event('FBObjectReady');
            document.dispatchEvent(fbInitEvent);
        };
        (((d, s, id) => {
            let js: any = d.getElementsByTagName(s)[0];
            const fjs: any = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            if (fjs) {
                fjs.parentNode.insertBefore(js, fjs);
            }
        })(document, 'script', 'facebook-jssdk'));
        document.addEventListener('FBObjectReady', this.checkLoginStatus);
    }

    public componentWillUnmount() {
        document.removeEventListener('FBObjectReady', this.checkLoginStatus);
    }

    public checkLoginStatus = () => {
        FB.getLoginStatus(this.facebookLoginHandler);
    }

    /**
     * Check login status and call login api is user is not logged in
     */
    public facebookLogin = () => {
        FB.getLoginStatus((response: any) => {
            if (response.status !== 'connected') {
                FB.login(this.facebookLoginHandler, {
                    scope: 'user_birthday,user_hometown,user_likes,user_photos,user_friends,user_status,user_tagged_places,user_posts,user_gender,user_link,email,public_profile'
                });
            }
        });
    }

    public facebookLoginHandler = (response: any) => {
        if (response.status === 'connected') {
            FB.api('/me', (userData: any) => {
                logger.debug(userData);
            },
                {
                    "fields": "id,email,gender,hometown,link,location,feed,events,music,games"
                }
            );
        }
    };

    public render() {
        return (
            <div className="widget">
                <div onClick={this.facebookLogin}
                    className="fb-login-button"
                    data-max-rows="1"
                    data-size="large"
                    data-button-type="continue_with"
                    data-use-continue-as="true"
                />
            </div>
        );
    }
}