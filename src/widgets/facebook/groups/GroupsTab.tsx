import * as React from "react";
import logger from "../../../utils/LogUtils";
import {getGroupsData} from "../FacebookAPI";
import IGroup from "./IGroup";

export default class GroupsTab extends React.Component {

    constructor(props: any) {
        super(props);
    }

    public componentDidMount() {
        getGroupsData()
            .then((result : IGroup[]) => {
                logger.debug(result);
            })
            .catch((error : Error) => {
                logger.debug(error);
            })
    }

    public render() {
        return (
            <div>
                Liste des groupes auxquels vous appartenez
            </div>
        )
    }
}