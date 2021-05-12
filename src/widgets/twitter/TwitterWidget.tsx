import * as React from "react";
import EmptyRSSWidget from '../rss/emptyWidget/EmptyRSSWidget';
import Widget from '../Widget';
import * as  crypto from "crypto";
import OAuth from "oauth-1.0a";
import * as request from "request";
import logger from "src/utils/LogUtils";

interface IProps {
    id: number;
    onDeleteButtonClicked: (id: number) => void;
    tabId: number;
}

export default function TwitterWidget(props: IProps): React.ReactElement {

    // Note: The token is optional for some requests
    const token: unknown = {
        key: '1339340779-hhYTPFrY5EFIieJC42WrXrs8Sg6eMH552Nqjff8',
        secret: '1r3Kk519wzoqlaG0ii28yAc9nQ6aQYehMf2w9HBRHsc7d',
        // key: "UwmrbQAAAAABG2eVAAABc",
        //  secret: "qz06kWiQZjqjGUzhGERGmEbGRuOo4qXY"
    }

    // https://api.twitter.com/oauth/request_token

    const request_data = {
        url: 'https://api.twitter.com/1.1/statuses/user_timeline.json?include_entities=true',
        method: 'POST',
        data: { screen_name: 'arnaudflaesch' },
    }

    const oauth = new OAuth({
        consumer: { key: '6gpcEC2lrca54mxCZfKx2Rdbu', secret: 'jt9HmXhMrBl8xd7HZGRIpWz6SMir9fpu5NYSu4v6KJogRfQoH9' },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string: string, key: string) {
            return crypto
                .createHmac('sha1', key)
                .update(base_string)
                .digest('base64')
        },
    })

    /* request(
        {
            url: request_data.url,
            method: request_data.method,
            form: oauth.authorize(request_data, token),
        },
        () => {

        }
    ) */
    const widgetHeader =
        <div>Header</div>

    const widgetBody =
        <div>Body</div>

    return <div>
        <Widget id={props.id} tabId={props.tabId}
            config={{ "url": "url" }}
            header={widgetHeader}
            body={widgetBody}
            editModeComponent={<EmptyRSSWidget url={""} onUrlSubmitted={() => { return null }} />}
            refreshFunction={() => { return null }}
            onDeleteButtonClicked={props.onDeleteButtonClicked} />
    </div>
}