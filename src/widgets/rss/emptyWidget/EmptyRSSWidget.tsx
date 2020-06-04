import * as React from 'react';
import { useState } from 'react';
import "./EmptyRSSWidget.scss";

interface IProps {
    url?: string;
    onUrlSubmitted: (url: string) => void;
}

export default function EmptyRSSWidget(props: IProps) {
    const [url, setUrl] = useState(props.url);
    const onChangeHandler = (event: any) => setUrl(event.target.value);
    const onValidation = () => {
        props.onUrlSubmitted(url!!);
    }

    return (
        <div>
            <input name="url" onChange={onChangeHandler} value={url} placeholder="Saisissez l'URL du flux RSS" />
            <button onClick={onValidation} disabled={!url || url?.length < 1} className="btn btn-success">
                Valider
            </button>
        </div>
    )
}