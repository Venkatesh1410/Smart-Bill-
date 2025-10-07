import {
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  ThemeProvider,
  Modal,
  CircularProgress,
  AlertColor,
  Box,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { ModalDialog } from "@mui/joy";
import {  useState } from "react";
import Toaster from "../toaster/toaster";
import { useForgotPassword } from "../../hooks/useForgotPassword";

interface ForgotPasswordModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalText?: string;
}

interface AuthFormFields {
  userName?: string;
  userEmail?: string;
  password?: string;
  confirmPassword?: string;
  userPhoneNo?: string;
}

const defaultTheme = createTheme();

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  open,
  setOpen,
  modalText,
}) => {
  const { forgotPassword, isLoading,error } = useForgotPassword();
  const [isAlert, setIsAlert] = useState(false);
  const [severity, setSeverity] = useState<AlertColor>("info");
  const [autoHideDuration, setAutoHideDuration] = useState(3000);
  const [alertMessage, setAlertMessage] = useState("");

  const {
    handleSubmit,
    register,
    setError,
    reset,
    formState: { errors },
  } = useForm<AuthFormFields>({
    defaultValues: {
      userEmail: "",
    },
  });
  const handleClose = () => {
    reset();
    setIsAlert(false);
  };

  const onSubmit = async (data: AuthFormFields) => {
    try {
      const formData = {
        userEmail: data.userEmail,
      };
      const responseData = await forgotPassword(formData);
      if (error) {
        setOpen(false);
        setIsAlert(true);
        setError("userEmail", {
          type: "custom",
          message: responseData?.message || "",
        });
      } else {
        setOpen(false);
        setIsAlert(true);
        setIsAlert(true);
        setSeverity("success");
        setAutoHideDuration(4000);
        setAlertMessage(responseData?.message || "");
      }
    } catch (error) {
      setError("userEmail", {
        type: "custom",
        message: error?.message,
      });
    }
  };

  return (
    <>
      {isAlert && alertMessage && (
        <Toaster
          isAlert={isAlert}
          severity={severity}
          autoHideDuration={autoHideDuration}
          handleClose={handleClose}
          alertMessage={alertMessage}
        />
      )}
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ThemeProvider theme={defaultTheme}>
              <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography component="h1" variant="h5">
                    {modalText ? modalText : "Forgot Password"}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="userEmail"
                      label="Email"
                      placeholder="Enter your email"
                      autoComplete="userEmail"
                      type="text"
                      autoFocus
                      {...register("userEmail", {
                        required: "Full Name is required",
                      })}
                      error={!!errors.userEmail}
                      helperText={errors.userEmail?.message}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mb: 2, mt: 2 }}
                    >
                      {isLoading ? (
                        <CircularProgress color="inherit" />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </Box>
                </Box>
              </Container>
            </ThemeProvider>
          </form>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default ForgotPasswordModal;
