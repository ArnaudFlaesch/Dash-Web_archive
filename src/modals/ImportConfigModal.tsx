import { ChangeEvent, ReactElement, useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { importConfig } from 'src/services/config.service';
import logger from 'src/utils/LogUtils';

export default function ImportConfigModal(): ReactElement {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [importConfigModal, setImportConfigModal] = useState(false);

  function toggleImportConfigModal() {
    setImportConfigModal(!importConfigModal);
  }

  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  }

  function upload() {
    if (selectedFile) {
      return importConfig(selectedFile)
        .then((response: boolean) => {
          if (response) {
            toggleImportConfigModal();
          }
        })
        .catch(() => {
          logger.error("Erreur lors de l'import du fichier");
        });
    }
  }

  return (
    <div>
      <Button
        id="openImportConfigModal"
        className="dashNavbarLink"
        onClick={toggleImportConfigModal}
      >
        <i className="fa fa-upload fa-lg" aria-hidden="true" />
      </Button>
      <Modal isOpen={importConfigModal} toggle={toggleImportConfigModal}>
        <ModalHeader toggle={toggleImportConfigModal}>
          Importer la configuration
        </ModalHeader>
        <ModalBody>
          <input type="file" id="file" name="file" onChange={selectFile} />

          <button
            className="btn btn-success"
            disabled={!selectedFile}
            onClick={upload}
          >
            Upload
          </button>
        </ModalBody>
        <ModalFooter>
          <Button
            id="closeImportConfigModal"
            color="primary"
            onClick={toggleImportConfigModal}
          >
            Fermer
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
