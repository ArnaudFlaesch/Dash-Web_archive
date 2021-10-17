import { CardActions, CardContent, Card, Button } from '@mui/material';
import { MouseEvent } from 'react';
import { WidgetTypes } from '../../enums/WidgetsEnum';

interface IProps {
  onWidgetAdded: (type: MouseEvent<HTMLButtonElement>) => void;
}

export default function Store(props: IProps): React.ReactElement {
  return (
    <div className="grid grid-cols-4 gap-3">
      {Object.keys(WidgetTypes).map((key) => {
        return (
          isNaN(parseInt(key, 0)) && (
            <Card key={key}>
              <CardContent>
                <div className="flex flex-col space-y-5">
                  <span>{key}</span>
                  <span>Widget {key}</span>
                  <span>Cliquez ci-dessous pour ajouter un widget {key} au dashboard.</span>
                </div>
              </CardContent>
              <CardActions>
                <Button
                  id={key}
                  onClick={props.onWidgetAdded}
                  variant="contained"
                  color="success"
                  value={WidgetTypes[key]}
                >
                  Ajouter
                </Button>
              </CardActions>
            </Card>
          )
        );
      })}
    </div>
  );
}
