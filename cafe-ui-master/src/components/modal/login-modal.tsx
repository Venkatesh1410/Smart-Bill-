import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
  ThemeProvider,
  Modal,
  Link,
  CircularProgress,
  AlertColor,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useForm } from "react-hook-form";
import { ModalDialog } from "@mui/joy";
import { useSignUp } from "../../hooks/useSignup";
import { useEffect, useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import Toaster from "../toaster/toaster";
import { useNavigate } from "react-router-dom";
import ForgotPasswordModal from "./forgot-password-modal";

interface LoginModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLogin: boolean;
  modalText?: string;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AuthFormFields {
  userName?: string;
  userEmail?: string;
  password?: string;
  confirmPassword?: string;
  userPhoneNo?: string;
}

const defaultTheme = createTheme();

const LoginModal: React.FC<LoginModalProps> = ({
  open,
  setOpen,
  isLogin,
  modalText,
  setIsLogin,
}) => {
  const { registerUser, isLoading, error } = useSignUp();
  const { loginUser, isLoading: isLoginLoading } = useLogin();
  const [isAlert, setIsAlert] = useState(false);
  const [severity, setSeverity] = useState<AlertColor>("info");
  const [autoHideDuration, setAutoHideDuration] = useState(3000);
  const [alertMessage, setAlertMessage] = useState("");
  const [isForgotPassword,setIsForgotPassword] = useState(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    watch,
    setError,
    reset,
    formState: { errors },
  } = useForm<AuthFormFields>({
    defaultValues: {
      userName: "",
      userEmail: "",
      password: "",
      confirmPassword: "",
      userPhoneNo: "",
    },
  });
  const handleClose = () => {
    setIsAlert(false);
  };

  useEffect(() => {
    // Reset the form values when isLogin changes
    const resetFormValues = () => {
      const defaultValues = {
        userName: "",
        userEmail: "",
        password: "",
        confirmPassword: "",
        userPhoneNo: "",
      };
      reset(defaultValues);
    };

    resetFormValues();
  }, [isLogin]);

  const onSubmit = async (data: AuthFormFields) => {
    try {
      if (!isLogin) {
        const formData = {
          userName: data.userName,
          userEmail: data.userEmail,
          password: data.password,
          userPhoneNo: data.userPhoneNo,
        };
        const responseData = await registerUser(formData);
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
      } else {
        const formData = {
          userEmail: data.userEmail,
          password: data.password,
        };
        const responseData = await loginUser(formData);
        if (error) {
          setOpen(false);
          setIsAlert(true);
        } else {
          setOpen(false);
          setIsAlert(true);
          navigate("/dashboard");
        }
      }
    } catch (error) {
      setError("userEmail", {
        type: "custom",
        message: !isLogin ? error?.message : "",
      });
      if (isLogin) {
        setIsAlert(true);
        setSeverity("warning");
        setAutoHideDuration(4000);
        setAlertMessage(error?.message || "");
      }
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
      <ForgotPasswordModal  open={isForgotPassword} setOpen={setIsForgotPassword}/>
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
                  <Avatar sx={{ bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    {modalText ? modalText : isLogin ? "Sign in" : "Sign up"}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {!isLogin && (
                      <TextField
                        margin="normal"
                        fullWidth
                        id="userName"
                        label="Full Name"
                        autoComplete="userName"
                        type="text"
                        autoFocus
                        {...register("userName", {
                          required: "Full Name is required",
                        })}
                        error={!!errors.userName}
                        helperText={errors.userName?.message}
                      />
                    )}
                    <TextField
                      margin="normal"
                      fullWidth
                      id="userEmail"
                      label="Email Address"
                      type="email"
                      {...register("userEmail", {
                        required: "Email is required",
                      })}
                      autoComplete="userEmail"
                      autoFocus
                      error={!!errors.userEmail}
                      helperText={errors.userEmail?.message}
                    />
                    <TextField
                      margin="normal"
                      fullWidth
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                      })}
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="password"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                    {!isLogin && (
                      <>
                        <TextField
                          margin="normal"
                          fullWidth
                          {...register("confirmPassword", {
                            required: "Confirm Password is required",
                            validate: (value) =>
                              value === watch("password") ||
                              "Passwords do not match",
                          })}
                          label="Confirm Password"
                          type="password"
                          id="confirmPassword"
                          autoComplete="new-password"
                          error={!!errors.confirmPassword}
                          helperText={errors.confirmPassword?.message}
                        />
                        <TextField
                          margin="normal"
                          fullWidth
                          label="Contact Number"
                          type="text"
                          id="userPhoneNo"
                          autoComplete="userPhoneNo"
                          {...register("userPhoneNo", {
                            required: "Contact number is required",
                          })}
                          error={!!errors.userPhoneNo}
                          helperText={errors.userPhoneNo?.message}
                        />
                      </>
                    )}
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mb: 2, mt: 2 }}
                    >
                      {isLoading || isLoginLoading ? (
                        <CircularProgress color="inherit" />
                      ) : isLogin ? (
                        "Sign In"
                      ) : (
                        "Sign Up"
                      )}
                    </Button>
                    {!modalText && (
                      <Grid container>
                        <Grid item xs>
                          <div onClick={()=>{setOpen(!open);setIsForgotPassword(true)}}>
                          <Link href="#" variant="body2">
                            Forgot password?
                          </Link>
                          </div>
                        </Grid>
                        <Grid item>
                          <div onClick={() => setIsLogin(!isLogin)}>
                            <Link href="#" variant="body2">
                              {isLogin
                                ? "Don't have an account? Sign Up"
                                : "Already have an account? Sign In"}
                            </Link>
                          </div>
                        </Grid>
                      </Grid>
                    )}
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

export default LoginModal;
