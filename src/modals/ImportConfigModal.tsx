import { ChangeEvent, ReactElement, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { importConfig } from 'src/services/config.service';
import logger from 'src/utils/LogUtils';
import UploadIcon from '@mui/icons-material/Upload';
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
      <IconButton id="openImportConfigModal" color="primary" onClick={toggleImportConfigModal}>
        <UploadIcon />
      </IconButton>
      <Dialog onClose={() => setImportConfigModal(false)} open={importConfigModal}>
        <DialogTitle>Importer la configuration</DialogTitle>
        <DialogContent>
          <input type="file" id="file" name="file" onChange={selectFile} />
        </DialogContent>
        <DialogActions>
          <Button id="closeImportConfigModal" onClick={toggleImportConfigModal} variant="contained">
            Annuler
          </Button>
          <Button id="uploadFileButton" disabled={!selectedFile} onClick={upload} variant="contained">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
