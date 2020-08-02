import * as React from "react";
import { useState } from 'react';
import './EmptyStravaWidget.scss';

interface IProps {
    clientId?: string;
    clientSecret?: string;
    onConfigSubmitted: (clientId: string, clientSecret: string) => void;
}

export default function EmptyStravaWidget(props: IProps) {
    const [clientId, setClientId] = useState(props.clientId || '');
    const [clientSecret, setClientSecret] = useState(props.clientSecret || '');
    const onClientIdChangeHandler = (event: any) => setClientId(event.target.value);
    const onClientSecretChangeHandler = (event: any) => setClientSecret(event.target.value);

    const onValidation = () => {
        props.onConfigSubmitted(clientId!!, clientSecret!!);
    }

    return (
        <div>
            <input name="clientId" onChange={onClientIdChangeHandler} value={clientId} placeholder="Saisissez le clientId" />
            <input name="clientSecret" onChange={onClientSecretChangeHandler} value={clientSecret} placeholder="Saisissez le clientSecret" />

            <button onClick={onValidation} disabled={!clientId || clientId?.length < 1 || !clientSecret || clientSecret?.length < 1} className="btn btn-success">
                Valider
            </button>
        </div>
    )
}