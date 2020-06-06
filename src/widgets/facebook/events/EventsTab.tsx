import * as React from "react";
import { useEffect } from 'react';
import logger from "../../../utils/LogUtils";

export default function EventsTab() {

    useEffect(() => {
        logger.debug("onComponentDidMount");
    })

    return (
        <div>
            Liste des prochains évènements
        </div>
    )
}