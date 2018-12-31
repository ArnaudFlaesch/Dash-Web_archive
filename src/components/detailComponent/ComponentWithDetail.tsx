import * as React from 'react';
import { Collapse } from "react-bootstrap";
import "./ComponentWithDetail.css";

interface IProps {
    componentRoot: React.ReactNode | string;
    componentDetail: React.ReactNode | string;
    link: string;
}

interface IState {
    openCollapse: boolean;
}

export default class ComponentWithDetail extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            openCollapse: false
        };
    }

    public toggleCollapse = () => {
        this.setState({ openCollapse: !this.state.openCollapse });
    }

    public render() {
        return (
            <div>
                <div onClick={this.toggleCollapse}>{this.props.componentRoot}</div>
                <div>
                    <Collapse in={this.state.openCollapse}>
                        <div>
                            {this.props.componentDetail}
                        </div>
                    </Collapse>
                </div>
            </div>
        );
    }
}