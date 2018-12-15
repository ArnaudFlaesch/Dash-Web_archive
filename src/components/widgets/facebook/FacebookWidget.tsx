import * as React from 'react';
import * as winston from 'winston';

interface IProps {
    appId?: string;
}

interface IFBResponse {
    name: string;
}


export class FacebookWidget extends React.Component<IProps> {

    constructor(props: IProps) {
        super(props);
        ((d, s, id) => {
            let js : any = d.getElementsByTagName(s)[0];
            const fjs : any = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return };
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
          })(document, 'script', 'facebook-jssdk');
    }

    

    public statusChangeCallback(response: any) {
        winston.log("debug", 'statusChangeCallback');
        winston.log("debug", response);
        // The response object is returned with a status field that lets the
        // app know the current login status of the person.
        // Full docs on the response object can be found in the documentation
        // for FB.getLoginStatus().
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            this.testAPI();
        } else {
            // The person is not logged into your app or we are unable to tell.
            if (document.getElementById('status') !== null) {
                winston.log("debug", 'Please log ' +
                    'into this app.');
            }

        }
    }

    // This function is called when someone finishes with the Login
    // Button.  See the onlogin handler attached to it in the sample
    // code below.
    public checkLoginState() {
        FB.getLoginStatus(response => {
            this.statusChangeCallback(response);
        });
    }


    public testAPI() {
        winston.log("debug", 'Welcome!  Fetching your information.... ');
        FB.api('/me', (response: IFBResponse) => {
            winston.log("debug", 'Successful login for: ' + response.name);
            winston.log("debug", 'Thanks for logging in, ' + response.name + '!');
        });
    }

    public render() {
        return (
            <div>
                fb
            </div>
        )
    }
}