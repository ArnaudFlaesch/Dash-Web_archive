import * as React from 'react';
import {  Card, CardBody, Collapse } from 'reactstrap';
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
                <div onClick={this.toggleCollapse} className="title">{this.props.componentRoot}</div>
                <div>
                    <Collapse isOpen={this.state.openCollapse}>
                        <Card>
                            <CardBody>
                                {this.props.componentDetail}
                            </CardBody>
                        </Card>
                    </Collapse>
                </div>
            </div>
        );
    }
}