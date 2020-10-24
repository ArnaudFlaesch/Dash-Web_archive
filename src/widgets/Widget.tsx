import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ModeEnum } from '../enums/ModeEnum';
import { ITabState } from '../reducers/tabReducer';
import DeleteWidget from './utils/DeleteWidget';

interface IProps {
    id: number;
    tabId: number;
    config: {};
    header: React.ReactElement;
    body: React.ReactElement;
    editModeComponent: React.ReactElement<IProps>;
    refreshFunction: () => void;
    onDeleteButtonClicked: (idWidget: number) => void;
}

export default function Widget(props: IProps) {
    const [mode, setMode] = useState(ModeEnum.READ);
    const [refreshIntervalId, setRefreshIntervalId] = useState<NodeJS.Timeout>();
    const activeTab = useSelector((state: ITabState) => state.activeTab);
    

    useEffect(() => {
        if (activeTab === props.tabId) {
            setRefreshIntervalId(setInterval(props.refreshFunction, 300000));
        } else if (refreshIntervalId) {
            clearInterval(refreshIntervalId);
        }
    }, [activeTab === props.tabId]);

    useEffect(() => {
        if (refreshIntervalId) {
            clearInterval(refreshIntervalId);
        }
        setRefreshIntervalId(setInterval(props.refreshFunction, 20000));
    }, [props.refreshFunction]);

    useEffect(() => {
        setMode(ModeEnum.READ);
    }, [props.config])

    function editWidget() {
        setMode(ModeEnum.EDIT);
    }

    function cancelDeletion() {
        setMode(ModeEnum.READ);
    }

    function deleteWidget() {
        setMode(ModeEnum.DELETE);
    }

    return (
        <div>
            {mode === ModeEnum.READ
                ?
                <div>
                    <div className="header">
                        <div className="leftGroup widgetHeader">
                            {props.header}
                        </div>
                        <div className="rightGroup">
                            <button onClick={editWidget} className="btn btn-default editButton"><i className="fa fa-cog" aria-hidden="true" /></button>
                            <button onClick={props.refreshFunction} className="btn btn-default refreshButton"><i className="fa fa-refresh" aria-hidden="true" /></button>
                            <button onClick={deleteWidget} className="btn btn-default deleteButton"><i className="fa fa-trash" aria-hidden="true" /></button>
                        </div>
                    </div>
                    {props.body}
                </div>
                : (mode === ModeEnum.DELETE)
                    ? <DeleteWidget idWidget={props.id} onDeleteButtonClicked={props.onDeleteButtonClicked} onCancelButtonClicked={cancelDeletion} />
                    : props.editModeComponent
            }
        </div>
    )
}