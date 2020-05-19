import * as React from 'react';
import './Store.scss';
import { WidgetTypes } from '../../enums/WidgetsEnum';
import { Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText, Button } from 'reactstrap';

interface IProps {
    onWidgetAdded: (type: any) => void;
}

const Store: React.FunctionComponent<IProps> = props => {
    return (
        <div className='flexRow'>
            {
                Object.keys(WidgetTypes).map((key) => {
                    return (
                        isNaN(parseInt(key)) &&
                        <Card>
                            <CardImg top width="100%" src="/assets/318x180.svg" alt="Card image cap" />
                            <CardBody>
                                <CardTitle>{key}</CardTitle>
                                <CardSubtitle>Widget {key}</CardSubtitle>
                                <CardText>Cliquez ci-dessous pour ajouter un widget {key} au dashboard.</CardText>
                                <Button onClick={props.onWidgetAdded} value={WidgetTypes[key]} className='btn btn-success'>Ajouter</Button>
                            </CardBody>
                        </Card>
                    )
                })
            }
        </div>
    )
}

export default Store;