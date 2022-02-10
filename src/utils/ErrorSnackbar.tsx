import { Alert, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IReducerState } from 'src/reducers/rootReducer';
import logger from './LogUtils';

export default function ErrorSnackbar(): React.ReactElement {
  const [isOpen, setOpen] = useState(true);
  const [customMessage, setCustomMessage] = useState('');
  const errorToHandle = useSelector((state: IReducerState) => state.errorToHandle);

  const verticalPosition = 'bottom';
  const horizontalPosition = 'center';

  useEffect(() => {
    if (errorToHandle) {
      handleError(errorToHandle?.error, errorToHandle?.customErrorMessage);
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [errorToHandle]);

  function handleError(error: Error, message: string) {
    logger.error(error.message);
    setCustomMessage(message);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <Snackbar
      id="errorSnackbar"
      anchorOrigin={{ vertical: verticalPosition, horizontal: horizontalPosition }}
      open={isOpen}
      autoHideDuration={4000}
      onClose={handleClose}
      key={verticalPosition + horizontalPosition}
    >
      <Alert severity="error">{customMessage}</Alert>
    </Snackbar>
  );
}
