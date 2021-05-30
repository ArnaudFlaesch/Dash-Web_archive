import { ReactElement, useState, MouseEvent } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
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
      <Button
        id="openAddWidgetModal"
        className="dashNavbarLink"
        onClick={toggleCreateWidgetModal}
      >
        <i className="fa fa-plus-circle fa-lg" aria-hidden="true" />
      </Button>
      <Modal isOpen={createWidgetModal} toggle={toggleCreateWidgetModal}>
        <ModalHeader toggle={toggleCreateWidgetModal}>
          Ajouter un widget
        </ModalHeader>
        <ModalBody>
          <Store onWidgetAdded={props.onWidgetAdded} />
        </ModalBody>
        <ModalFooter>
          <Button
            id="closeAddWidgetModal"
            color="primary"
            onClick={toggleCreateWidgetModal}
          >
            Fermer
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
