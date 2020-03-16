import * as React from 'react';

interface IProps {
    token? : string;
}

export class StravaWidget extends React.Component {

    constructor(props : IProps) {
        super(props);
    }

    public render() {
        return (<div></div>)
    }
}