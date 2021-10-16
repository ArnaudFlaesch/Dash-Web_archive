import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { MouseEvent, ReactElement, useState } from 'react';
import Store from 'src/pages/store/Store';
interface IProps {
  onWidgetAdded: (type: MouseEvent<HTMLButtonElement>) => void;
}

export default function CreateWidgetModal(props: IProps): ReactElement {
  const [createWidgetModal, setCreateWidgetModal] = useState(false);

  function toggleCreateWidgetModal() {
    setCreateWidgetModal(!createWidgetModal);
  }

  return (
    <div>
      <IconButton id="openAddWidgetModal" color="primary" onClick={toggleCreateWidgetModal}>
        <AddCircleOutlineIcon />
      </IconButton>
      <Dialog onClose={() => setCreateWidgetModal(false)} open={createWidgetModal}>
        <DialogTitle>Ajouter un widget</DialogTitle>
        <DialogContent>
          <Store onWidgetAdded={props.onWidgetAdded} />
        </DialogContent>

        <DialogActions>
          <Button id="closeAddWidgetModal" onClick={toggleCreateWidgetModal} variant="contained">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
