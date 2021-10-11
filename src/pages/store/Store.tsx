import { FunctionComponent, MouseEvent } from 'react';
import { Button, Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle } from 'reactstrap';
import { WidgetTypes } from '../../enums/WidgetsEnum';

interface IProps {
  onWidgetAdded: (type: MouseEvent<HTMLButtonElement>) => void;
}

const Store: FunctionComponent<IProps> = (props) => {
  return (
    <div className="grid grid-cols-4 gap-3">
      {Object.keys(WidgetTypes).map((key) => {
        return (
          isNaN(parseInt(key, 0)) && (
            <Card key={key}>
              <CardImg top={true} width="100%" src="/assets/318x180.svg" alt="Card image cap" />
              <CardBody>
                <CardTitle>{key}</CardTitle>
                <CardSubtitle>Widget {key}</CardSubtitle>
                <CardText>Cliquez ci-dessous pour ajouter un widget {key} au dashboard.</CardText>
                <Button id={key} onClick={props.onWidgetAdded} className="btn btn-success" value={WidgetTypes[key]}>
                  Ajouter
                </Button>
              </CardBody>
            </Card>
          )
        );
      })}
    </div>
  );
};

export default Store;
