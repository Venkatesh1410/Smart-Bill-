import { Alert, AlertColor, Snackbar } from "@mui/material";

interface ToasterProps {
  isAlert: boolean;
  handleClose: () => void;
  autoHideDuration: number;
  severity: AlertColor;
  alertMessage: string;
}
const Toaster = ({
  isAlert,
  handleClose,
  autoHideDuration,
  severity,
  alertMessage
}: ToasterProps) => {
  return (
    <Snackbar
      open={isAlert}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {alertMessage}
      </Alert>
    </Snackbar>
  );
};

export default Toaster;
