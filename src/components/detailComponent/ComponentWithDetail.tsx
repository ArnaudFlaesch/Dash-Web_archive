import * as React from 'react';
import { useState } from 'react';
import { Card, CardBody, Collapse } from 'reactstrap';
import "./ComponentWithDetail.scss";

interface IProps {
    componentRoot: React.ReactNode | string;
    componentDetail: React.ReactNode | string;
    link?: string;
}

export default function ComponentWithDetail(props: IProps) {
    const [openCollapse, setOpenCollapse] = useState(false);
    const toggleCollapse = () => {
        setOpenCollapse(!openCollapse);
    }

    return (
        <div>
            <div onClick={toggleCollapse} className="title">{props.componentRoot}</div>
            <div>
                <Collapse isOpen={openCollapse}>
                    <Card>
                        <CardBody>
                            {props.componentDetail}
                        </CardBody>
                    </Card>
                </Collapse>
            </div>
        </div>
    );
}