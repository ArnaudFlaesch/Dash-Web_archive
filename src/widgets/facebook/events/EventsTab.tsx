import * as React from "react";
import logger from "../../../utils/LogUtils";

export default class EventsTab extends React.Component {
    constructor(props: any) {
        super(props);
    }

    public componentDidmount() {
        logger.debug("onComponentDidMount");
    }

    public render() {
        return (
            <div>
                Liste des prochains évènements
            </div>
        )
    }
}